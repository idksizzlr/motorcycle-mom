-- Administradores gerenciam o site e não aparecem no ranking.
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
      and not p.is_admin
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
revoke execute on function public.ranking(text, date) from public, anon;
grant execute on function public.ranking(text, date) to authenticated;
