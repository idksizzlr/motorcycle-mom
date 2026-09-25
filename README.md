# Por Onde Rodei

Mapa interativo dos 5.570 municípios do Brasil para marcar as cidades por onde você já passou de moto.
Tem contas de usuário, diário de viagem, níveis e conquistas, ranking com comparação de mapas e painel de administrador.

## Como funciona

| Parte | Onde roda |
|---|---|
| Site (HTML/CSS/JS puro, sem build) | Vercel |
| Login, contas e banco de dados | Supabase (projeto `por-onde-rodei`, região São Paulo) |
| Cron diário que evita a pausa do Supabase grátis | Vercel Cron → `api/keepalive.js` |

```
index.html            estrutura das telas
css/app.css           estilos (claro/escuro, celular/tablet/PC)
js/app.js             lógica do app
js/config.js          URL e chave pública do Supabase
data/municipios.json  malha dos municípios (IBGE, simplificada)
api/keepalive.js      função chamada pelo cron
supabase/migrations/  SQL do banco (tabelas, regras de acesso, ranking, admin)
```

## Segurança

- Cada pessoa só lê e altera as próprias marcações: isso é garantido pelas regras RLS do Postgres, não pelo site.
- O ranking mostra só números (cidades, estados, capitais) de quem aceitou aparecer.
- Funções de admin (`admin_usuarios`, `admin_definir_senha`, `admin_excluir_usuario`) conferem no banco se quem chama é admin.
- `js/config.js` contém só a chave **publishable**, feita para ficar no navegador. Nunca coloque a chave `secret`/`service_role` no repositório.

## Tornar alguém administrador

No Supabase → SQL Editor:

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'SEU-EMAIL@exemplo.com');
```

Depois disso, a aba **Admin** aparece para essa conta e ela pode promover outras pessoas pelo próprio painel.

## Rodar no computador

```bash
npm run dev
```

Abre em http://localhost:3000. O site usa o mesmo banco do Supabase de produção.

Fonte dos mapas: IBGE — Malha Municipal (API de malhas v3).
