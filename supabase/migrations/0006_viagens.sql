-- Planejamento de viagens: roteiro com paradas, caminho pela estrada e conclusão.
-- paradas: [{ "id": "4309100", "feito": false, "data": null, "criou": false }, ...]  (em ordem)
-- caminho: ["4304408", ...]  municípios por onde a estrada passa entre as paradas
-- rota:    [[lon, lat], ...] traçado simplificado da estrada (nulo = linha reta)
create table public.viagens (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references public.profiles on delete cascade,
  nome           text not null default 'Nova viagem' check (char_length(nome) between 1 and 60),
  inicio         date,
  fim            date,
  status         text not null default 'planejada' check (status in ('planejada','em_andamento','concluida')),
  paradas        jsonb not null default '[]'::jsonb check (jsonb_typeof(paradas) = 'array' and jsonb_array_length(paradas) <= 150),
  caminho        jsonb not null default '[]'::jsonb check (jsonb_typeof(caminho) = 'array' and jsonb_array_length(caminho) <= 3000),
  rota           jsonb check (rota is null or (jsonb_typeof(rota) = 'array' and jsonb_array_length(rota) <= 2000)),
  km             int,
  horas          numeric(6,1),
  notas          text check (char_length(notas) <= 1000),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now(),
  concluida_em   timestamptz
);
create index viagens_user_idx on public.viagens (user_id);

create or replace function public.tocar_atualizado_em()
returns trigger language plpgsql set search_path = '' as $$
begin new.atualizado_em := now(); return new; end; $$;
create trigger viagens_atualizado before update on public.viagens
  for each row execute function public.tocar_atualizado_em();
revoke execute on function public.tocar_atualizado_em() from public, anon, authenticated;

alter table public.viagens enable row level security;
create policy "viagens: ler as suas ou admin" on public.viagens
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "viagens: criar as suas" on public.viagens
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "viagens: editar as suas" on public.viagens
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "viagens: apagar as suas ou admin" on public.viagens
  for delete to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));

grant select, insert, update, delete on public.viagens to authenticated;
notify pgrst, 'reload schema';
