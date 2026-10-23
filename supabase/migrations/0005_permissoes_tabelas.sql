-- Garante o acesso da API às tabelas (projetos novos podem não liberar por padrão).
-- Quem pode ver o quê continua decidido pelas regras RLS.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.visitas to authenticated;
grant select on public.profiles to anon;   -- só para o despertador diário; RLS não mostra nenhuma linha
notify pgrst, 'reload schema';
