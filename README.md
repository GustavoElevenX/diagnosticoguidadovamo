# Raio-X de Vazamento Comercial VAMO

Diagnóstico guiado comercial da VAMO em formato de micro-app estático com APIs server-side em Express e Netlify Functions.

## Decisão de arquitetura

Este projeto roda como app separado para o MVP:

- Frontend estático em `index.html`
- Servidor local Express em `server.js`
- Deploy recomendado em Netlify
- Persistência no Supabase
- IA apenas no backend/server-side
- Aprendizado diário via Netlify Scheduled Function

Se a VAMO decidir integrar dentro da plataforma principal em Next.js, a lógica central já está isolada em `lib/` para reaproveitamento.

## Rotas principais

- `POST /api/diagnostico/start`
- `POST /api/diagnostico/message`
- `POST /api/diagnostico/finalize`
- `GET /api/diagnostico/:id/report`
- `POST /api/internal/daily-learning`

## Configuração

1. Rode `sql/schema.sql` no SQL Editor do Supabase.
2. Copie `.env.example` para `.env.local` ou configure as variáveis no ambiente.
3. Preencha `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `NEXT_PUBLIC_VAMO_WHATSAPP_NUMBER` e `INTERNAL_CRON_SECRET`.
4. Rode localmente com:

```bash
npm run dev
```

## Aprendizado diário

O projeto inclui `netlify/functions/scheduled-daily-learning.mjs`, agendado para rodar diariamente às `09:00 UTC`.

Também é possível acionar manualmente via `POST /api/internal/daily-learning` usando `INTERNAL_CRON_SECRET`.

Em produção, `INTERNAL_CRON_SECRET` é obrigatório. Sem essa variável, a rotina falha fechada para evitar execução pública sem validação.
