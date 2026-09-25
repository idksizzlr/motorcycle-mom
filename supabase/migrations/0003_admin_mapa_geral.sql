-- Mapa geral do administrador: quantas pessoas passaram por cada município (e quem).
create or replace function public.admin_mapa_geral()
returns table (municipio_id text, pessoas int, nomes text[])
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso restrito a administradores';
  end if;
  return query
    select v.municipio_id, count(*)::int, (array_agg(p.nome order by p.nome))[1:12]
    from public.visitas v
    join public.profiles p on p.id = v.user_id
    group by v.municipio_id;
end;
$$;
revoke execute on function public.admin_mapa_geral() from public, anon;
grant execute on function public.admin_mapa_geral() to authenticated;
