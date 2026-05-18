import OpenAI from 'openai';
import { buildFallbackReport, normalizeReport } from './diagnostic-analysis.js';
import { getBlock } from './diagnostic-questions.js';

let openaiClient = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiClient) openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openaiClient;
}

function extractJson(raw) {
  if (!raw) throw new Error('Resposta vazia da IA.');
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Resposta da IA não contém JSON válido.');
    return JSON.parse(match[0]);
  }
}

function answersSummary(answers = {}) {
  return Object.entries(answers)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('\n');
}

export async function generateBlockInsight({ blockId, answers = {}, recentLearning = '' }) {
  const block = getBlock(blockId);
  const fallback = block?.insight || 'Com essas respostas, já dá para ver sinais importantes sobre previsibilidade, gestão e correção comercial.';
  const openai = getOpenAIClient();
  if (!openai) return fallback;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.35,
      max_tokens: 180,
      messages: [
        {
          role: 'system',
          content: `Você é a IA de Performance Comercial da VAMO.

Gere um insight curto, consultivo e direto em português brasileiro.

Regras:
- Não venda a plataforma.
- Não fale como chatbot genérico.
- Não use markdown.
- Não ensine o usuário a construir a solução sozinho.
- Comece sempre pelo problema comercial, não pela IA.
- Trate IA como meio para corrigir gargalos, não como promessa principal.
- Fale sobre vazamento de vendas, previsibilidade, follow-up, velocidade, gestão, CRM, adoção, processo e operação comercial.
- Evite comissão/incentivo, exceto se a resposta do usuário trouxer isso espontaneamente.
- No máximo 60 palavras.${recentLearning ? `\n\nAprendizados recentes internos:\n${recentLearning}` : ''}`,
        },
        {
          role: 'user',
          content: `Bloco: ${block?.title || blockId}\nRespostas até agora:\n${answersSummary(answers)}\n\nGere 1 parágrafo com no máximo 60 palavras.`,
        },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || fallback;
  } catch (error) {
    console.error('[OpenAI] Falha no insight intermediário:', error.message);
    return fallback;
  }
}

export async function generateFinalReport({ diagnostic, recentLearning = '' }) {
  const fallback = buildFallbackReport(diagnostic);
  const openai = getOpenAIClient();
  if (!openai) return fallback;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.25,
      max_tokens: 1800,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Você é a IA de Performance Comercial da VAMO.

Sua função é gerar o relatório final do Mapa de Vazamento de Vendas VAMO.

A VAMO não vende IA isolada, bot, CRM, automação solta, dashboard genérico ou sistema avulso.
A VAMO identifica onde a operação comercial está perdendo vendas e implanta a estrutura para corrigir isso com processo, IA, automações, sistemas e acompanhamento.

Regras obrigatórias:
- Comece pelo problema comercial, não pela tecnologia.
- Não venda a plataforma diretamente.
- Não faça perguntas novas.
- Nunca prometa aumento de faturamento.
- Não invente dados financeiros.
- Não use linguagem de guru de IA.
- Não diga que basta usar ChatGPT, Codex ou ferramenta pronta.
- Não ensine o cliente a construir sozinho.
- Mostre o custo de construir errado.
- Retorne exatamente 3 vazamentos principais.
- A IA deve aparecer como camada de inteligência operacional, não como promessa mágica.
- Se o principal problema for falta de lead, avalie também se há perda no aproveitamento dos leads que já chegam.
- Se houver baixa adoção de CRM/processo/ferramenta, destaque que ferramenta sem processo vira mais uma tela esquecida.
- Retorne somente JSON válido, sem markdown.

Formato obrigatório:
{
  "score_vendas_previsiveis": numero de 0 a 100,
  "nivel_operacao": string,
  "resumo_executivo": texto curto,
  "scores_pilares": {
    "previsibilidade_comercial": numero de 0 a 100,
    "aproveitamento_oportunidades": numero de 0 a 100,
    "velocidade_followup": numero de 0 a 100,
    "gestao_funil_crm": numero de 0 a 100,
    "processo_adocao": numero de 0 a 100,
    "clareza_prioridade": numero de 0 a 100
  },
  "vazamentos": [
    { "titulo": string, "explicacao": string, "impacto": string, "prioridade": "alta" | "media" | "baixa" }
  ],
  "contradicoes": array de strings,
  "estrutura_recomendada": {
    "nome": string,
    "tipo": string,
    "motivo": string,
    "proximo_passo": string
  },
  "recomendacao_imediata": texto curto,
  "plano_acao": array com 3 passos objetivos,
  "fit_vamo_score": numero de 0 a 100,
  "recomendacao_comercial": "reunião imediata" | "nutrição" | "sem fit",
  "mensagem_cta": texto curto
}

Use como referência os scores determinísticos já calculados, mas ajuste levemente se as respostas abertas indicarem risco maior ou menor.${recentLearning ? `\n\nAprendizados recentes internos da VAMO:\n${recentLearning}` : ''}`,
        },
        {
          role: 'user',
          content: `Lead: ${diagnostic.lead_name || '-'} | Empresa: ${diagnostic.company_name || '-'} | Cargo: ${diagnostic.role || '-'} | Segmento: ${diagnostic.segment || diagnostic.raw_answers?.segment || '-'}

Respostas:
${answersSummary(diagnostic.raw_answers || {})}

Relatorio base calculado:
${JSON.stringify(fallback, null, 2)}`,
        },
      ],
    });

    const parsed = extractJson(completion.choices[0]?.message?.content?.trim());
    return normalizeReport(parsed, diagnostic);
  } catch (error) {
    console.error('[OpenAI] Falha no relatório final:', error.message);
    return fallback;
  }
}

export async function generateDailyLearning({ diagnostics = [] }) {
  const emptyFallback = {
    recurring_patterns: [],
    best_segments: [],
    common_objections: [],
    question_improvements: [],
    prompt_improvements: [],
    sales_insights: [],
    recommended_structure_patterns: [],
    summary: 'Ainda há poucos diagnósticos finalizados para gerar aprendizados confiáveis.',
  };

  if (!diagnostics.length) return emptyFallback;

  const openai = getOpenAIClient();
  if (!openai) {
    return {
      ...emptyFallback,
      summary: `Foram encontrados ${diagnostics.length} diagnósticos, mas a chave de IA não está configurada. Análise manual recomendada.`,
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.25,
      max_tokens: 1400,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Você é a inteligência estratégica interna da VAMO.
Analise diagnósticos comerciais finalizados e encontre padrões para melhorar perguntas, classificação de leads, abordagem comercial, copy, argumentos de venda e priorização de implantação.

Procure padrões de:
- vazamentos comerciais mais frequentes;
- segmentos com maior fit;
- origem de oportunidade com maior potencial;
- estruturas VAMO mais recomendadas;
- sinais de urgência real;
- objeções prováveis;
- respostas contraditórias;
- perguntas com possível abandono;
- oportunidades de melhorar o diagnóstico sem deixá-lo longo.

Retorne JSON válido com:
recurring_patterns, best_segments, common_objections, question_improvements, prompt_improvements, sales_insights, recommended_structure_patterns, summary.
Não invente padrões sem base. Se houver poucos diagnósticos, deixe claro que os sinais ainda são fracos.`,
        },
        {
          role: 'user',
          content: JSON.stringify(diagnostics.map((item) => ({
            company_name: item.company_name,
            role: item.role,
            seller_count: item.seller_count,
            sales_channel: item.sales_channel,
            sales_model: item.sales_model,
            score_previsibilidade: item.score_previsibilidade,
            score_fit_vamo: item.score_fit_vamo,
            recommended_next_step: item.recommended_next_step,
            answers: item.raw_answers,
            report: item.final_report,
          }))),
        },
      ],
    });

    return { ...emptyFallback, ...extractJson(completion.choices[0]?.message?.content?.trim()) };
  } catch (error) {
    console.error('[OpenAI] Falha no aprendizado diário:', error.message);
    return {
      ...emptyFallback,
      summary: `A rotina encontrou ${diagnostics.length} diagnósticos, mas a IA falhou. Sinais salvos para nova análise.`,
    };
  }
}
