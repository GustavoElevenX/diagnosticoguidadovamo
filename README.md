# Mapa de Vazamento de Vendas VAMO

Diagnóstico guiado comercial da VAMO em formato de micro-app estático com APIs server-side em Express, Netlify Functions e Vercel Functions.

## Decisão de arquitetura

Este projeto roda como app separado para o MVP:

- Frontend estático em `index.html`
- Servidor local Express em `server.js`
- Deploy em Netlify ou Vercel
- Persistência no Supabase
- IA apenas no backend/server-side
- Aprendizado diário via Netlify Scheduled Function ou endpoint interno

Se a VAMO decidir integrar dentro da plataforma principal em Next.js, a lógica central já está isolada em `lib/` para reaproveitamento.

## Rotas principais

- `POST /api/diagnostico/start`
- `POST /api/diagnostico/message`
- `POST /api/diagnostico/finalize`
- `GET /api/diagnostico/:id/report`
- `POST /api/internal/daily-learning`

## Versão ativa

Versão interna ativa: `mapa-vazamento-vendas-v3-posicionamento-atual`.

Esta versão do diagnóstico segue o posicionamento atual da VAMO:

- Menos venda perdida. Mais previsibilidade comercial.
- Diagnóstico antes da ferramenta.
- Processo antes da IA.
- IA como camada de inteligência operacional.
- Implantação com acompanhamento, não software isolado.

O diagnóstico começa pela operação comercial, lê processo real, encontra vazamentos, mede visibilidade do gestor, rotina, adoção e recomenda a primeira estrutura comercial a priorizar, como Diagnóstico e Priorização VAMO, Agente Qualificador, Máquina de Follow-up, Copiloto do Gestor, Proposta Inteligente ou CRM Vivo / Camada de Inteligência do Funil.

A especificação atual está em `docs/diagnostico_vamo_v3_posicionamento_atual.md`. A documentação v2 antiga foi arquivada em `docs/arquivo_legado_comissao_v2.md` e não deve ser usada como fonte de verdade do produto atual.

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
