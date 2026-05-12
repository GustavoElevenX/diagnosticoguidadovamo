# IMPLEMENTAÇÃO — V2 DO DIAGNÓSTICO COM IA GUIADA DA VAMO

## 1. Contexto geral

A VAMO já possui uma plataforma e um diagnóstico comercial inicial. O objetivo agora não é criar um projeto totalmente novo do zero, mas sim **refatorar e evoluir o diagnóstico existente** para uma experiência muito mais forte, consultiva e conversacional.

A VAMO não deve parecer apenas uma plataforma, um formulário ou um chatbot genérico.

A nova experiência deve ser uma **IA vertical de performance comercial**, especializada em identificar gargalos, vazamentos de receita, baixa previsibilidade, problemas de comissão, falhas de acompanhamento e ausência de rotina de correção em times comerciais.

A experiência deve parecer familiar para usuários acostumados com ChatGPT, Claude e Gemini, mas sem ser um chat livre genérico. Deve ser um **chat guiado inteligente**, com identidade visual da VAMO, estrutura controlada, perguntas adaptativas, leitura consultiva durante a conversa e relatório final visual.

---

## 2. Objetivo principal

Criar uma nova versão do diagnóstico comercial da VAMO com o conceito:

# Raio-X de Vazamento Comercial VAMO

Promessa da experiência:

> Em até 10 minutos, descubra onde sua operação comercial pode estar perdendo previsibilidade, performance e dinheiro depois que o lead chega.

A experiência deve:

1. Conduzir o usuário por uma conversa guiada.
2. Fazer perguntas estratégicas sobre a operação comercial.
3. Adaptar algumas perguntas de acordo com o contexto.
4. Entregar pequenos insights durante a conversa.
5. Gerar um relatório visual final com scores, dashboards e plano de ação.
6. Salvar todo diagnóstico no banco de dados.
7. Salvar as mensagens/respostas da conversa.
8. Classificar o lead por maturidade comercial e fit com a VAMO.
9. Criar uma rotina diária de aprendizado, onde a IA analisa os diagnósticos finalizados e gera aprendizados para melhorar perguntas, padrões e abordagem.
10. Preparar o lead para contato via WhatsApp ou reunião comercial.

---

## 3. Decisão técnica importante

Não usar VPS nesse MVP.

A arquitetura recomendada é:

- Frontend/App: Next.js já existente
- Banco: Supabase
- IA: API externa server-side, como OpenAI, Gemini ou Claude
- Rotina diária: Supabase Edge Function + Supabase Cron ou Vercel Cron
- Chaves de IA: somente no backend/server-side, nunca no frontend

A IA não será “treinada do zero”. O conceito de retroalimentação será feito por:

- salvamento dos diagnósticos;
- análise diária dos diagnósticos;
- geração de aprendizados estratégicos;
- uso dos aprendizados recentes como contexto nos próximos diagnósticos;
- sugestões de melhoria nas perguntas e pesos do score.

---

## 4. O que NÃO deve ser feito

Não criar um formulário comum.

Não criar um chat totalmente livre sem direção.

Não criar uma experiência longa demais.

Não pedir muitos dados antes de entregar valor.

Não vender a plataforma logo no início.

Não prometer aumento de faturamento sem base.

Não deixar a IA fugir do escopo comercial.

Não permitir que o usuário converse sobre qualquer assunto.

Não expor chave de IA no frontend.

Não gerar relatório apenas em texto.

Não deixar elementos visuais sobrepostos, textos cortados ou cards quebrados.

---

## 5. Experiência desejada

A interface deve ser inspirada na familiaridade de um chat moderno, como ChatGPT/Claude, mas com identidade visual VAMO.

Características:

- layout limpo;
- bolhas de conversa;
- avatar/nome da IA da VAMO;
- botões de resposta rápida;
- campo de texto quando necessário;
- barra de progresso;
- tempo estimado;
- blocos de diagnóstico;
- pequenos insights durante a conversa;
- resultado final visual em formato de dashboard.

Não é um chat genérico. É um diagnóstico guiado.

O usuário deve sentir:

> “Estou conversando com uma IA que entende de operação comercial, não apenas respondendo um formulário.”

---

## 6. Nome da experiência

Usar preferencialmente:

# Raio-X de Vazamento Comercial VAMO

Subtítulo:

> Uma inteligência comercial da VAMO criada para identificar onde sua operação perde previsibilidade, performance e dinheiro depois que o lead chega.

Também pode usar internamente:

- VAMO Intelligence
- IA de Performance Comercial VAMO
- Diagnóstico Guiado VAMO

Mas a comunicação principal deve ser “Raio-X de Vazamento Comercial”.

---

## 7. Tempo máximo da experiência

O diagnóstico deve levar entre 7 e 10 minutos.

Para isso:

- usar majoritariamente respostas por botão;
- usar texto livre apenas quando necessário;
- limitar a quantidade de perguntas;
- não chamar IA em absolutamente todas as etapas;
- usar IA principalmente para interpretar respostas abertas, gerar insights intermediários e criar relatório final.

Estrutura recomendada:

- 80% respostas rápidas por botão;
- 20% texto livre.

---

## 8. Estrutura do diagnóstico

O diagnóstico deve ser dividido em 5 blocos principais:

1. Contexto comercial
2. Previsibilidade
3. Vazamento de performance
4. Comissão e incentivo
5. Gestão e correção

Cada bloco deve ter perguntas objetivas e, quando necessário, uma pergunta aberta curta.

---

## 9. Bloco 1 — Contexto comercial

Objetivo: entender se existe fit inicial com a VAMO.

Perguntas sugeridas:

### Pergunta 1
Hoje, quantas pessoas atuam diretamente em vendas?

Opções:
- 1 a 2
- 3 a 5
- 6 a 10
- 11 a 20
- 21+

### Pergunta 2
Quem acompanha a performance comercial hoje?

Opções:
- O próprio dono
- Gerente comercial
- Coordenador/líder de vendas
- Cada vendedor se acompanha sozinho
- Ninguém acompanha com frequência

### Pergunta 3
Qual é o principal canal de venda hoje?

Opções:
- WhatsApp
- Ligação
- Presencial
- CRM
- Instagram/Redes sociais
- Misto

### Pergunta 4
O seu processo comercial é mais:

Opções:
- Venda simples e rápida
- Venda consultiva
- Venda recorrente
- Venda de ticket alto
- Venda B2B
- Não sei definir

Insight esperado da IA após esse bloco:

A IA deve devolver uma leitura breve, por exemplo:

> Com esse tamanho de time, normalmente os principais riscos aparecem em três áreas: acompanhamento de meta, clareza de comissão e capacidade do gestor corrigir o time antes do mês fechar. Vou investigar esses pontos agora.

---

## 10. Bloco 2 — Previsibilidade

Objetivo: descobrir se a empresa consegue prever o resultado antes do fim do mês.

Perguntas sugeridas:

### Pergunta 1
Hoje você consegue saber, antes do fim do mês, se o time vai bater a meta?

Opções:
- Sim, com clareza
- Mais ou menos
- Só percebo perto do fechamento
- Não tenho essa visão

### Pergunta 2
Quantos vendedores normalmente batem meta?

Opções:
- Quase todos
- Mais da metade
- Menos da metade
- Poucos
- Não tenho esse número claro

### Pergunta 3
Com que frequência a performance do time é acompanhada?

Opções:
- Diariamente
- Semanalmente
- Quinzenalmente
- Só no fim do mês
- Quando surge problema

### Pergunta aberta curta
Qual é hoje a maior dificuldade para prever o resultado comercial do mês?

Insight esperado da IA:

A IA deve identificar se a operação é preventiva ou reativa.

Exemplo:

> Pelo que você respondeu, sua operação parece acompanhar resultado, mas ainda pode estar enxergando o problema tarde demais. Isso indica risco de gestão reativa: o gestor só percebe o gargalo quando já perdeu parte do mês.

---

## 11. Bloco 3 — Vazamento de performance

Objetivo: identificar onde o comercial perde dinheiro depois que o lead chega.

Perguntas sugeridas:

### Pergunta 1
Hoje, onde você acredita que sua operação mais perde resultado?

Opções:
- Falta de leads
- Falta de follow-up
- Baixa conversão
- Falta de gestão
- Vendedores sem ritmo
- Leads esquecidos
- Não sei identificar

### Pergunta 2
Existem leads que deixam de ser respondidos ou acompanhados corretamente?

Opções:
- Sim, acontece com frequência
- Às vezes
- Raramente
- Não sei medir
- Não acontece

### Pergunta 3
Quando um vendedor performa abaixo do esperado, vocês sabem rapidamente o motivo?

Opções:
- Sim, temos clareza
- Às vezes
- Só depois de analisar manualmente
- Não sabemos com precisão
- Não acompanhamos isso

### Pergunta aberta curta
Se você pudesse corrigir um problema comercial nos próximos 30 dias, qual seria?

Insight esperado da IA:

A IA deve conectar a resposta com vazamento comercial.

Exemplo:

> Aqui aparece um possível vazamento importante: a empresa pode até gerar oportunidades, mas parte do resultado se perde dentro da operação por falta de acompanhamento, follow-up ou correção rápida.

---

## 12. Bloco 4 — Comissão e incentivo

Objetivo: conectar uma dor financeira direta à proposta da VAMO.

Perguntas sugeridas:

### Pergunta 1
Hoje sua empresa trabalha com comissão para vendedores?

Opções:
- Sim
- Não
- Parcialmente
- Estamos estruturando

### Pergunta 2
Como a comissão é calculada atualmente?

Opções:
- Manualmente
- Planilha
- Sistema interno
- CRM/ERP
- Não temos regra clara

### Pergunta 3
O vendedor consegue acompanhar durante o mês quanto está próximo de receber?

Opções:
- Sim, com clareza
- Mais ou menos
- Só no fechamento
- Não consegue acompanhar
- Não sei

### Pergunta 4
Já houve dúvida, erro ou conflito relacionado a comissão?

Opções:
- Sim, frequentemente
- Algumas vezes
- Raramente
- Nunca
- Não sei

Insight esperado da IA:

Exemplo:

> A comissão existe, mas parece funcionar mais como pagamento no fechamento do que como ferramenta de comportamento durante o mês. Isso reduz o poder da comissão como motor de performance.

---

## 13. Bloco 5 — Gestão e correção

Objetivo: entender se existe rotina para corrigir performance antes do problema se consolidar.

Perguntas sugeridas:

### Pergunta 1
Quando um vendedor não performa bem, existe algum plano de ação individual?

Opções:
- Sim, estruturado
- Às vezes
- Apenas conversas pontuais
- Não existe
- Não sei

### Pergunta 2
Existe algum tipo de PDI, treinamento ou acompanhamento individual?

Opções:
- Sim
- Parcialmente
- Apenas quando há problema
- Não
- Não sei

### Pergunta 3
O gestor tem dados suficientes para corrigir o time antes do mês acabar?

Opções:
- Sim, com clareza
- Parcialmente
- Só depois de analisar manualmente
- Não
- Não sei

### Pergunta final de urgência
Você pretende corrigir esses problemas em quanto tempo?

Opções:
- Agora / próximos 30 dias
- Próximos 60 dias
- Próximos 90 dias
- Sem previsão
- Estou apenas pesquisando

Insight esperado da IA:

Exemplo:

> A operação apresenta sinais de baixa capacidade de correção antecipada. Isso significa que o time pode até ter meta, mas a gestão não tem ferramentas suficientes para corrigir a rota antes do fechamento do mês.

---

## 14. Captura de lead

Não pedir todos os dados logo no início.

### No início
Pedir apenas:
- nome;
- empresa;
- cargo.

### No meio do diagnóstico
Depois de já entregar algum insight, pedir:

> Para salvar seu Raio-X e enviar o resultado completo, qual WhatsApp podemos usar?

Campos:
- WhatsApp
- e-mail opcional

### No final
Perguntar:

> Você quer receber uma leitura personalizada desse diagnóstico no WhatsApp?

Opções:
- Sim, quero receber
- Prefiro apenas ver o resultado aqui
- Quero conversar com alguém da VAMO

---

## 15. Relatório final

O relatório final deve ser visual, não apenas textual.

Deve conter:

1. Score geral de previsibilidade comercial
2. Nível da operação
3. Radar de maturidade
4. Mapa de vazamentos comerciais
5. Consequência prática dos gargalos
6. Plano de ação em 3 passos
7. Indicação do próximo passo
8. CTA para WhatsApp ou reunião

---

## 16. Score geral

Criar um score de 0 a 100 chamado:

# Score de Previsibilidade Comercial

Faixas sugeridas:

- 0 a 25: Operação no escuro
- 26 a 50: Operação reativa
- 51 a 70: Operação parcialmente previsível
- 71 a 85: Operação gerenciável
- 86 a 100: Operação escalável

Esse score deve considerar:

- quantidade de vendedores;
- frequência de acompanhamento;
- clareza sobre metas;
- quantidade de vendedores batendo meta;
- previsibilidade antes do fechamento;
- clareza de comissão;
- capacidade de correção individual;
- urgência declarada;
- existência de rotina de gestão.

---

## 17. Score de fit com a VAMO

Criar também um score interno, não necessariamente visível para o usuário:

# Score de Fit VAMO

Critérios positivos:

- 5 ou mais vendedores;
- existe comissão;
- acompanhamento de meta é falho;
- operação depende de WhatsApp/vendas consultivas;
- gestor não sabe onde o time trava;
- vendedor não acompanha comissão em tempo real;
- empresa quer corrigir nos próximos 30/60 dias;
- existe dor de previsibilidade.

Classificação interna:

- 0 a 39: Baixo fit
- 40 a 69: Fit médio
- 70 a 100: Alto fit

Se for alto fit, marcar como prioridade comercial.

---

## 18. Radar de maturidade

O relatório deve ter notas de 0 a 100 para os seguintes pilares:

1. Previsibilidade de meta
2. Gestão de performance
3. Comissão e incentivo
4. Rotina de acompanhamento
5. Correção individual
6. Aproveitamento de oportunidades

Essas notas devem ser calculadas com base nas respostas.

Pode usar gráfico radar se já houver biblioteca no projeto. Se não houver, pode usar cards ou barras horizontais.

---

## 19. Mapa de vazamentos

A IA deve gerar entre 3 e 5 vazamentos principais.

Exemplos:

- Meta acompanhada tarde demais
- Comissão pouco conectada ao comportamento
- Gestor sem visão individual clara
- Leads sem acompanhamento consistente
- Falta de rotina de correção semanal
- Performance dependente de esforço individual
- Baixa clareza sobre quem está travando o resultado
- Falta de dados para prever o fechamento do mês

Cada vazamento deve ter:

- título;
- explicação curta;
- impacto provável;
- prioridade: alta, média ou baixa.

---

## 20. Plano de ação

O relatório deve gerar um plano de ação em 3 passos.

Exemplo:

1. Definir indicadores semanais por vendedor.
2. Reestruturar a comissão para incentivar comportamento certo.
3. Criar rotina de correção antes do fechamento do mês.

O plano deve ser específico de acordo com as respostas.

---

## 21. CTA final

O CTA não deve ser agressivo.

Sugestão:

> Seu diagnóstico indica vazamentos que podem estar afetando a previsibilidade comercial da empresa. A VAMO pode mostrar, em uma conversa de 20 minutos, quais seriam as primeiras correções para estruturar meta, comissão e performance.

Botões:

- Receber leitura no WhatsApp
- Agendar conversa estratégica
- Baixar/Salvar diagnóstico

---

## 22. Diferencial de detecção de contradições

A IA deve identificar contradições nas respostas.

Exemplos:

### Contradição 1
Usuário diz que acompanha performance, mas responde que só vê resultado no fim do mês.

Interpretação:

> Existe acompanhamento, mas ele parece ser mais retrospectivo do que preditivo. O problema é percebido tarde demais.

### Contradição 2
Usuário diz que tem metas, mas poucos vendedores sabem onde estão no mês.

Interpretação:

> A meta existe, mas não funciona como ferramenta diária de gestão.

### Contradição 3
Usuário diz que paga comissão, mas vendedor só sabe quanto recebe no fechamento.

Interpretação:

> A comissão existe, mas não está sendo usada como motor de comportamento durante o mês.

Essas contradições devem aparecer no relatório ou nos insights intermediários.

---

## 23. Lógica de IA

Não chamar IA em todas as perguntas objetivas.

### Fluxo recomendado

Perguntas objetivas:
- o sistema segue a próxima etapa sem chamar IA.

Respostas abertas:
- chamar IA para interpretação curta.

Final de cada bloco:
- chamar IA para gerar insight intermediário.

Final do diagnóstico:
- chamar IA para gerar relatório completo.

Rotina diária:
- chamar IA para gerar aprendizado agregado.

Isso reduz custo, melhora velocidade e evita lentidão.

---

## 24. Prompt base da IA do diagnóstico

Criar um prompt base semelhante a este:

```txt
Você é a IA de Performance Comercial da VAMO.

Sua função é conduzir um diagnóstico rápido, consultivo e objetivo para identificar vazamentos de receita, baixa previsibilidade, falhas de comissão, ausência de rotina de gestão e gaps de performance individual em operações comerciais.

Você não é uma IA genérica. Você atua exclusivamente no contexto de performance comercial, gestão de vendas, comissão, metas, acompanhamento, previsibilidade e correção de vendedores.

Regras:
- Não venda a plataforma diretamente no início.
- Não faça perguntas genéricas.
- Não deixe a conversa fugir do contexto comercial.
- Use linguagem clara, consultiva e direta.
- Se identificar contradições, aponte com cuidado.
- Gere pequenos insights durante o diagnóstico.
- Mantenha o diagnóstico dentro de 7 a 10 minutos.
- Priorize clareza, impacto e próximos passos.
- Nunca prometa aumento de faturamento sem base.
- Sempre conecte os problemas a consequências práticas. 

Com base nas respostas do diagnóstico, gere um relatório estruturado para o Raio-X de Vazamento Comercial VAMO.

Retorne obrigatoriamente em JSON válido.

O relatório deve conter:
1. score_previsibilidade: número de 0 a 100.
2. nivel_operacao: string.
3. resumo_executivo: texto curto.
4. scores_pilares: objeto com notas de 0 a 100 para:
   - previsibilidade_meta
   - gestao_performance
   - comissao_incentivo
   - rotina_acompanhamento
   - correcao_individual
   - aproveitamento_oportunidades
5. vazamentos: array com 3 a 5 itens, cada item contendo:
   - titulo
   - explicacao
   - impacto
   - prioridade
6. contradicoes: array com possíveis contradições identificadas.
7. plano_acao: array com 3 passos objetivos.
8. fit_vamo_score: número de 0 a 100.
9. recomendacao_comercial: uma das opções:
   - reunião imediata
   - nutrição
   - sem fit
10. mensagem_cta: texto curto convidando para WhatsApp ou conversa estratégica.

Não use markdown.
Não invente dados financeiros.
Não prometa resultado garantido.
26. Banco de dados — Supabase

Criar ou atualizar as tabelas necessárias.

Tabela diagnostics
create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  lead_name text,
  company_name text,
  role text,
  whatsapp text,
  email text,
  segment text,
  seller_count text,
  sales_channel text,
  sales_model text,
  current_step text,
  status text default 'started',
  raw_answers jsonb default '{}'::jsonb,
  score_previsibilidade integer,
  score_fit_vamo integer,
  maturity_level text,
  main_leaks jsonb default '[]'::jsonb,
  contradictions jsonb default '[]'::jsonb,
  pillar_scores jsonb default '{}'::jsonb,
  final_report jsonb default '{}'::jsonb,
  recommended_next_step text,
  consent_contact boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);
Tabela diagnostic_messages
create table if not exists diagnostic_messages (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid references diagnostics(id) on delete cascade,
  sender text not null,
  message text not null,
  answer_type text,
  step text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);
Tabela daily_ai_learning
create table if not exists daily_ai_learning (
  id uuid primary key default gen_random_uuid(),
  learning_date date default current_date,
  diagnostics_analyzed integer default 0,
  recurring_patterns jsonb default '[]'::jsonb,
  best_segments jsonb default '[]'::jsonb,
  common_objections jsonb default '[]'::jsonb,
  question_improvements jsonb default '[]'::jsonb,
  prompt_improvements jsonb default '[]'::jsonb,
  sales_insights jsonb default '[]'::jsonb,
  summary text,
  created_at timestamp with time zone default now()
);
Tabela opcional diagnostic_question_versions
create table if not exists diagnostic_question_versions (
  id uuid primary key default gen_random_uuid(),
  version_name text not null,
  questions jsonb not null,
  active boolean default false,
  created_at timestamp with time zone default now()
);
27. Políticas e segurança

Ativar RLS conforme o padrão do projeto.

Para MVP, se o diagnóstico for público, criar políticas que permitam:

inserir diagnóstico;
inserir mensagens relacionadas ao diagnóstico;
atualizar o diagnóstico pelo próprio fluxo server-side.

Preferencialmente, as operações sensíveis devem passar por API server-side usando service role, não diretamente pelo cliente.

Nunca expor:

SUPABASE_SERVICE_ROLE_KEY no frontend;
OPENAI_API_KEY/GEMINI_API_KEY/ANTHROPIC_API_KEY no frontend.
28. Rotas/API necessárias

Criar ou adaptar rotas server-side.

POST /api/diagnostico/start

Função:

cria um novo diagnóstico;
salva nome, empresa e cargo;
retorna diagnostic_id e primeira mensagem/pergunta.

Body esperado:

{
  "lead_name": "Nome",
  "company_name": "Empresa",
  "role": "Cargo"
}
POST /api/diagnostico/message

Função:

recebe resposta do usuário;
salva mensagem;
atualiza raw_answers;
determina próxima pergunta;
se necessário, chama IA para insight intermediário;
retorna próxima mensagem, opções e progresso.

Body esperado:

{
  "diagnostic_id": "uuid",
  "step": "contexto_comercial",
  "answer": "6 a 10",
  "answer_type": "button"
}
POST /api/diagnostico/finalize

Função:

pega todas as respostas;
chama IA para gerar relatório final;
calcula ou valida scores;
salva final_report;
marca status como completed;
retorna relatório visual para frontend.
GET /api/diagnostico/[id]/report

Função:

retorna o relatório de um diagnóstico finalizado.
POST /api/internal/daily-learning

Função:

busca diagnósticos finalizados nas últimas 24 horas ou desde a última análise;
envia dados agregados para IA;
gera resumo de aprendizados;
salva em daily_ai_learning;
não deve expor publicamente sem autenticação interna.
29. Prompt para rotina diária de aprendizado
Você é a inteligência estratégica interna da VAMO.

Analise os diagnósticos comerciais finalizados no período informado.

Seu objetivo é encontrar padrões que ajudem a VAMO a melhorar:
- perguntas do diagnóstico;
- classificação de leads;
- abordagem comercial;
- copy de prospecção;
- argumentos de venda;
- entendimento dos segmentos com maior fit.

Retorne em JSON válido com:
1. recurring_patterns: padrões recorrentes encontrados.
2. best_segments: segmentos ou perfis com maior fit.
3. common_objections: objeções ou sinais de resistência.
4. question_improvements: sugestões de melhoria nas perguntas.
5. prompt_improvements: sugestões de melhoria no prompt da IA.
6. sales_insights: insights úteis para abordagem comercial.
7. summary: resumo executivo do aprendizado do dia.

Não invente padrões sem base.
Se houver poucos diagnósticos, deixe claro que os sinais ainda são fracos.
30. Uso dos aprendizados nos próximos diagnósticos

Ao iniciar um novo diagnóstico, o sistema pode buscar os últimos aprendizados de daily_ai_learning, por exemplo os últimos 7 dias, e inserir como contexto para IA.

Mas cuidado:

não jogar diagnósticos crus inteiros no prompt;
usar apenas resumos estratégicos;
limitar tamanho do contexto;
priorizar aprendizados recentes;
nunca expor dados de outras empresas ao usuário.

Exemplo de contexto interno:

Aprendizados recentes da VAMO:
- Empresas com 5 a 12 vendedores têm apresentado maior dor em comissão manual e baixa previsibilidade.
- A pergunta sobre CRM gerou pouco insight.
- A pergunta sobre previsibilidade antes do fechamento gerou respostas mais úteis.
- Leads com urgência de 30 dias e comissão em planilha devem ser priorizados.
31. Frontend — Layout

Criar uma página/rota para o novo diagnóstico.

Sugestão de rota:

/diagnostico

ou

/raio-x-comercial

Se já existir uma rota de diagnóstico, preservar a versão antiga ou substituí-la com cuidado.

Componentes sugeridos:

DiagnosticChatPage
DiagnosticChat
ChatMessage
QuickReplyOptions
ProgressIndicator
InsightCard
LeadCaptureStep
DiagnosticReport
ScoreCard
RadarChart ou PillarScores
LeakMap
ActionPlan
FinalCTA
32. UI/UX obrigatória

A interface precisa ser muito limpa e responsiva.

Requisitos:

sem sobreposição de texto;
sem cards quebrando;
sem texto atrás de formas;
sem overflow horizontal;
responsivo em mobile e desktop;
botões grandes e fáceis de clicar;
contraste bom;
evitar parágrafos longos dentro das bolhas;
usar cards para insights;
usar barra de progresso clara;
mostrar tempo estimado;
manter CTA final visível e objetivo.
33. Visual do relatório

O relatório final deve parecer um mini dashboard.

Elementos:

Card 1

Score geral:

número grande;
nível da operação;
resumo curto.
Card 2

Radar ou barras de maturidade:

previsibilidade de meta;
gestão de performance;
comissão e incentivo;
rotina de acompanhamento;
correção individual;
aproveitamento de oportunidades.
Card 3

Mapa de vazamentos:

3 a 5 cards;
prioridade alta/média/baixa.
Card 4

Contradições identificadas:

mostrar apenas se houver.
Card 5

Plano de ação:

3 passos.
Card 6

CTA:

WhatsApp;
agendar conversa;
salvar diagnóstico.
34. Lógica de qualificação comercial

Ao finalizar o diagnóstico, classificar internamente:

Reunião imediata

Quando:

score_fit_vamo >= 70;
empresa tem 5+ vendedores;
existe dor em previsibilidade/comissão/gestão;
urgência de 30 ou 60 dias.
Nutrição

Quando:

score_fit_vamo entre 40 e 69;
empresa tem alguma dor, mas pouca urgência ou estrutura menor.
Sem fit

Quando:

não tem vendedores;
não tem meta;
não tem comissão;
está apenas pesquisando;
score_fit_vamo < 40.

Essa recomendação deve ser salva no banco em recommended_next_step.

35. WhatsApp CTA

No final, o botão de WhatsApp deve abrir uma mensagem pré-preenchida.

Exemplo:

Olá, fiz o Raio-X de Vazamento Comercial da VAMO e quero receber uma leitura do meu diagnóstico.

Se possível, incluir dados:

Olá, fiz o Raio-X Comercial da VAMO. Meu score foi {{score}} e quero entender os principais vazamentos da minha operação.

O número do WhatsApp deve vir de variável de ambiente, exemplo:

NEXT_PUBLIC_VAMO_WHATSAPP_NUMBER=
36. Variáveis de ambiente

Adicionar ao .env.example:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
# ou
GEMINI_API_KEY=
# ou
ANTHROPIC_API_KEY=

NEXT_PUBLIC_VAMO_WHATSAPP_NUMBER=

INTERNAL_CRON_SECRET=

A API de IA deve ser usada apenas no backend.

37. Performance

O diagnóstico precisa ser rápido.

Regras:

não chamar IA para toda resposta de botão;
usar IA apenas em pontos estratégicos;
mostrar estado de carregamento claro;
evitar longos waits sem feedback;
gerar relatório final com loading visual;
se a IA falhar, usar fallback básico de relatório.

Fallback:

Não conseguimos gerar a análise completa agora, mas salvamos suas respostas. Nossa equipe pode enviar uma leitura pelo WhatsApp.

38. Estados de erro

Implementar:

erro ao salvar diagnóstico;
erro ao salvar mensagem;
erro na IA;
erro ao finalizar relatório;
diagnóstico incompleto;
usuário atualizando a página;
usuário abandonando no meio.

Se possível, persistir diagnostic_id no localStorage para continuar o diagnóstico se a página recarregar.

39. Dashboard interno mínimo

Se já existir área administrativa, adicionar uma tela simples para listar diagnósticos.

Campos:

nome;
empresa;
cargo;
WhatsApp;
score_previsibilidade;
score_fit_vamo;
recomendação;
data;
status.

Filtros:

alto fit;
reunião imediata;
nutrição;
finalizados;
abandonados.

Se não houver tempo, pelo menos garantir que os dados estão bem salvos no Supabase.

40. Plano de implementação
Etapa 1 — Inspecionar projeto atual

Antes de alterar, verificar:

estrutura de rotas;
onde está o diagnóstico atual;
como Supabase está configurado;
se já existem tabelas de leads/diagnósticos;
como a IA está sendo chamada hoje;
componentes visuais existentes;
design system da VAMO;
variáveis de ambiente já usadas.
Etapa 2 — Criar estrutura de banco

Gerar arquivo SQL/migration com as tabelas:

diagnostics
diagnostic_messages
daily_ai_learning
opcional diagnostic_question_versions

Não aplicar automaticamente se o projeto não tiver pipeline de migration. Deixar instrução clara para o usuário rodar no Supabase SQL Editor.

Etapa 3 — Criar fluxo guiado

Implementar o fluxo com os 5 blocos:

Contexto comercial
Previsibilidade
Vazamento de performance
Comissão e incentivo
Gestão e correção

Criar lista de perguntas em arquivo separado, por exemplo:

src/lib/diagnostic/questions.ts
Etapa 4 — Criar API server-side

Criar endpoints para:

iniciar diagnóstico;
salvar resposta;
avançar pergunta;
finalizar diagnóstico;
gerar relatório;
rotina diária de aprendizado.
Etapa 5 — Criar UI conversacional

Criar tela estilo chat guiado, com:

mensagens;
botões;
inputs;
insights;
progresso;
loading;
relatório final.
Etapa 6 — Criar relatório visual

Implementar cards de score, pilares, vazamentos e plano de ação.

Etapa 7 — Criar retroalimentação diária

Implementar endpoint interno daily-learning.

Depois, instruir usuário a configurar:

Supabase Cron;
ou Vercel Cron;
usando INTERNAL_CRON_SECRET.
41. Critérios de aceite

A implementação só estará correta se:

O diagnóstico parecer uma conversa guiada, não um formulário.
O usuário conseguir terminar em até 10 minutos.
As respostas forem salvas no banco.
Cada mensagem for salva em diagnostic_messages.
O relatório final for salvo em diagnostics.final_report.
O relatório final mostrar score, nível, vazamentos, pilares e plano de ação.
O diagnóstico gerar score de previsibilidade.
O diagnóstico gerar score interno de fit com a VAMO.
O CTA final levar para WhatsApp ou conversa estratégica.
A IA não fugir do contexto comercial.
A chave da IA não aparecer no frontend.
O layout não tiver sobreposição, texto cortado ou cards quebrados.
A rotina diária de aprendizado estiver implementada ou pelo menos preparada.
O usuário receber instruções claras do que precisa configurar no Supabase.
42. Instruções finais que o Codex deve entregar ao usuário

Ao finalizar a implementação, o Codex deve informar claramente:

No Supabase, o usuário precisa:
Abrir o Supabase.
Entrar no projeto da VAMO.
Ir em SQL Editor.
Rodar o script/migration gerado.
Conferir se as tabelas foram criadas:
diagnostics
diagnostic_messages
daily_ai_learning
diagnostic_question_versions, se criada.
Configurar RLS/policies se necessário.
Conferir se as variáveis do Supabase estão corretas.
No ambiente do projeto, o usuário precisa:
Adicionar as variáveis no .env.local.
Inserir a chave da IA escolhida.
Inserir o número de WhatsApp da VAMO.
Inserir INTERNAL_CRON_SECRET.
Rodar o projeto localmente.
Testar um diagnóstico completo.
Confirmar se o diagnóstico apareceu no Supabase.
Confirmar se o relatório foi salvo.
Confirmar se o botão de WhatsApp funciona.
Para rotina diária:

Se usar Supabase Cron:

criar uma chamada diária para o endpoint/função de aprendizado;
proteger com INTERNAL_CRON_SECRET.

Se usar Vercel Cron:

configurar o cron no vercel.json;
apontar para /api/internal/daily-learning;
proteger com INTERNAL_CRON_SECRET.
43. Observação estratégica

A VAMO não está criando um “chatbot”.

A VAMO está criando uma inteligência vertical para diagnosticar operações comerciais.

A diferença de valor é:

ChatGPT responde perguntas genéricas.
A VAMO conduz um diagnóstico estruturado.
A VAMO identifica vazamentos comerciais.
A VAMO pontua maturidade.
A VAMO gera relatório visual.
A VAMO salva histórico.
A VAMO aprende com os diagnósticos.
A VAMO transforma isso em oportunidade comercial.

Essa diferença precisa aparecer na experiência, no texto, na interface e no relatório.