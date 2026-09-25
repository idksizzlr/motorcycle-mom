-- Por Onde Rodei — esquema do banco
-- Perfis, visitas, ranking e funções de administração.

-- ---------------------------------------------------------------
-- Perfis
-- ---------------------------------------------------------------
create table public.profiles (
  id               uuid primary key references auth.users on delete cascade,
  nome             text not null check (char_length(nome) between 2 and 40),
  genero           text not null default 'nao_informado'
                   check (genero in ('mulher','homem','outro','nao_informado')),
  papel            text not null default 'os_dois'
                   check (papel in ('piloto','garupa','os_dois')),
  moto             text check (char_length(moto) <= 60),
  pilota_desde     int  check (pilota_desde between 1940 and 2100),
  cidade_id        text check (cidade_id ~ '^[0-9]{7}$'),
  estilo           text not null default 'de_tudo'
                   check (estilo in ('estrada','serra','praia','terra','de_tudo')),
  aparece_ranking  boolean not null default true,
  is_admin         boolean not null default false,
  criado_em        timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Visitas (uma linha por município marcado)
-- ---------------------------------------------------------------
create table public.visitas (
  user_id       uuid not null default auth.uid() references public.profiles on delete cascade,
  municipio_id  text not null check (municipio_id ~ '^[0-9]{7}$'),
  data          date,
  nota          text check (char_length(nota) <= 280),
  criado_em     timestamptz not null default now(),
  primary key (user_id, municipio_id)
);
create index visitas_user_idx on public.visitas (user_id);

-- ---------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$;

-- Cria o perfil a partir dos dados enviados no cadastro
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, nome, genero, papel, moto, pilota_desde, cidade_id, estilo, aparece_ranking)
  values (
    new.id,
    coalesce(nullif(left(trim(m->>'nome'), 40), ''), split_part(new.email, '@', 1)),
    case when m->>'genero' in ('mulher','homem','outro') then m->>'genero' else 'nao_informado' end,
    case when m->>'papel' in ('piloto','garupa','os_dois') then m->>'papel' else 'os_dois' end,
    nullif(left(trim(m->>'moto'), 60), ''),
    case when (m->>'pilota_desde') ~ '^[0-9]{4}$' and (m->>'pilota_desde')::int between 1940 and 2100
         then (m->>'pilota_desde')::int end,
    case when (m->>'cidade_id') ~ '^[0-9]{7}$' then m->>'cidade_id' end,
    case when m->>'estilo' in ('estrada','serra','praia','terra','de_tudo') then m->>'estilo' else 'de_tudo' end,
    coalesce((m->>'aparece_ranking')::boolean, true)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Só admin pode mudar is_admin
create or replace function public.protect_admin_flag()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.is_admin is distinct from old.is_admin and not public.is_admin() then
    raise exception 'Somente administradores podem mudar essa permissão';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_admin
  before update on public.profiles
  for each row execute function public.protect_admin_flag();

-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.visitas  enable row level security;

create policy "perfil: ler o seu ou admin" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "perfil: editar o seu ou admin" on public.profiles
  for update to authenticated using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));
create policy "perfil: admin apaga" on public.profiles
  for delete to authenticated using ((select public.is_admin()));

create policy "visitas: ler as suas ou admin" on public.visitas
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "visitas: criar as suas" on public.visitas
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "visitas: editar as suas ou admin" on public.visitas
  for update to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()))
  with check (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "visitas: apagar as suas ou admin" on public.visitas
  for delete to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));

-- ---------------------------------------------------------------
-- Ranking (só números públicos de quem aceitou aparecer)
-- ---------------------------------------------------------------
create or replace function public.ranking(p_genero text default null, p_desde date default null)
returns table (
  posicao int, user_id uuid, nome text, genero text, papel text, moto text,
  cidades int, estados int, capitais int, eh_voce boolean
)
language sql stable security definer set search_path = ''
as $$
  with caps(id) as (values
    ('1100205'),('1200401'),('1302603'),('1400100'),('1501402'),('1600303'),('1721000'),
    ('2111300'),('2211001'),('2304400'),('2408102'),('2507507'),('2611606'),('2704302'),
    ('2800308'),('2927408'),('3106200'),('3205309'),('3304557'),('3550308'),('4106902'),
    ('4205407'),('4314902'),('5002704'),('5103403'),('5208707'),('5300108')),
  agg as (
    select p.id, p.nome, p.genero, p.papel, p.moto,
           count(v.municipio_id)::int as cidades,
           count(distinct left(v.municipio_id, 2))::int as estados,
           count(c.id)::int as capitais
    from public.profiles p
    join public.visitas v on v.user_id = p.id
    left join caps c on c.id = v.municipio_id
    where (p.aparece_ranking or p.id = auth.uid())
      and (p_genero is null or p.genero = p_genero)
      and (p_desde is null or v.data >= p_desde)
    group by p.id
  )
  select (rank() over (order by cidades desc, estados desc))::int,
         id, nome, genero, papel, moto, cidades, estados, capitais, id = auth.uid()
  from agg
  order by 1, nome
  limit 100;
$$;

-- Mapa de outra pessoa (só se ela aparece no ranking)
create or replace function public.mapa_publico(p_user uuid)
returns table (municipio_id text)
language sql stable security definer set search_path = ''
as $$
  select v.municipio_id from public.visitas v
  join public.profiles p on p.id = v.user_id
  where v.user_id = p_user and (p.aparece_ranking or p.id = auth.uid() or public.is_admin());
$$;

-- ---------------------------------------------------------------
-- Administração
-- ---------------------------------------------------------------
create or replace function public.admin_usuarios()
returns table (
  id uuid, email text, nome text, genero text, papel text, moto text, pilota_desde int,
  cidade_id text, estilo text, aparece_ranking boolean, is_admin boolean,
  criado_em timestamptz, ultimo_acesso timestamptz, cidades int, ultima_visita date
)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores';
  end if;
  return query
    select p.id, u.email::text, p.nome, p.genero, p.papel, p.moto, p.pilota_desde,
           p.cidade_id, p.estilo, p.aparece_ranking, p.is_admin,
           p.criado_em, u.last_sign_in_at,
           (select count(*)::int from public.visitas v where v.user_id = p.id),
           (select max(v.data) from public.visitas v where v.user_id = p.id)
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.criado_em desc;
end;
$$;

create or replace function public.admin_excluir_usuario(p_user uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores';
  end if;
  if p_user = auth.uid() then
    raise exception 'Você não pode excluir a própria conta pelo painel';
  end if;
  delete from auth.users where id = p_user;
end;
$$;

create or replace function public.admin_definir_senha(p_user uuid, p_senha text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores';
  end if;
  if char_length(p_senha) < 6 then
    raise exception 'A senha precisa ter pelo menos 6 caracteres';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(p_senha, extensions.gen_salt('bf')),
         updated_at = now()
   where id = p_user;
end;
$$;

-- A pessoa pode apagar a própria conta
create or replace function public.excluir_minha_conta()
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- Usado pelo cron da Vercel para o projeto não pausar
create or replace function public.ping()
returns text language sql stable set search_path = '' as $$ select 'pong'::text $$;

-- Permissões de execução
revoke execute on function public.handle_new_user(), public.protect_admin_flag() from public, anon, authenticated;
revoke execute on function public.ranking(text, date), public.mapa_publico(uuid), public.admin_usuarios(),
  public.admin_excluir_usuario(uuid), public.admin_definir_senha(uuid, text), public.excluir_minha_conta(),
  public.is_admin() from public, anon;
grant execute on function public.ranking(text, date), public.mapa_publico(uuid), public.admin_usuarios(),
  public.admin_excluir_usuario(uuid), public.admin_definir_senha(uuid, text), public.excluir_minha_conta(),
  public.is_admin() to authenticated;
grant execute on function public.ping() to anon, authenticated;
