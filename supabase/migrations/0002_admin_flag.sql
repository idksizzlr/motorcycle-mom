-- Pelo site (usuário logado) só admin muda is_admin; pelo SQL Editor do Supabase (sem JWT) é liberado.
create or replace function public.protect_admin_flag()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.is_admin is distinct from old.is_admin
     and coalesce(auth.role(), '') in ('authenticated', 'anon')
     and not public.is_admin() then
    raise exception 'Somente administradores podem mudar essa permissão';
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_admin_flag() from public, anon, authenticated;
