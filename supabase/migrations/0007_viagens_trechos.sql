-- Cidades atravessadas pela estrada em cada trecho da viagem (ela não voa!).
-- trechos[k] = caminho entre a parada k e a parada k+1:
--   { "ids": ["3510005", ...],      municípios por onde a estrada passa
--     "criadas": ["3510005", ...] } os que entraram no mapa por causa desta viagem (para desfazer)
alter table public.viagens
  add column trechos jsonb not null default '[]'::jsonb
  check (jsonb_typeof(trechos) = 'array' and jsonb_array_length(trechos) <= 150);
notify pgrst, 'reload schema';
