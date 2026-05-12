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
    if (!match) throw new Error('Resposta da IA nao contem JSON valido.');
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
  const fallback = block?.insight || 'Com essas respostas, ja da para ver sinais importantes sobre previsibilidade, gestao e correcao comercial.';
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
          content: `Voce e a IA de Performance Comercial da VAMO. Gere um insight curto, consultivo e direto em portugues brasileiro. Nao venda a plataforma. Nao use markdown. Fique estritamente em gestao comercial, meta, comissao, previsibilidade, follow-up e correcao de vendedores.${recentLearning ? `\n\nAprendizados recentes internos:\n${recentLearning}` : ''}`,
        },
        {
          role: 'user',
          content: `Bloco: ${block?.title || blockId}\nRespostas ate agora:\n${answersSummary(answers)}\n\nGere 1 paragrafo com no maximo 60 palavras.`,
        },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || fallback;
  } catch (error) {
    console.error('[OpenAI] Falha no insight intermediario:', error.message);
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
          content: `Voce e a IA de Performance Comercial da VAMO.

Sua funcao e gerar o relatorio final do Raio-X de Vazamento Comercial VAMO.
Voce nao e uma IA generica. Atue exclusivamente em performance comercial, gestao de vendas, comissao, metas, acompanhamento, previsibilidade, follow-up e correcao de vendedores.

Regras:
- Nao venda a plataforma diretamente.
- Nao faca perguntas novas.
- Nao fuja do contexto comercial.
- Use linguagem clara, consultiva e direta.
- Aponte contradicoes com cuidado.
- Nunca prometa aumento de faturamento.
- Nao invente dados financeiros.
- Retorne somente JSON valido, sem markdown.

Formato obrigatorio:
{
  "score_previsibilidade": numero de 0 a 100,
  "nivel_operacao": string,
  "resumo_executivo": texto curto,
  "scores_pilares": {
    "previsibilidade_meta": numero de 0 a 100,
    "gestao_performance": numero de 0 a 100,
    "comissao_incentivo": numero de 0 a 100,
    "rotina_acompanhamento": numero de 0 a 100,
    "correcao_individual": numero de 0 a 100,
    "aproveitamento_oportunidades": numero de 0 a 100
  },
  "vazamentos": [
    { "titulo": string, "explicacao": string, "impacto": string, "prioridade": "alta" | "media" | "baixa" }
  ],
  "contradicoes": array de strings,
  "plano_acao": array com 3 passos objetivos,
  "fit_vamo_score": numero de 0 a 100,
  "recomendacao_comercial": "reuniao imediata" | "nutricao" | "sem fit",
  "mensagem_cta": texto curto
}

Use como referencia os scores deterministicos ja calculados, mas ajuste levemente se as respostas abertas indicarem risco maior ou menor.${recentLearning ? `\n\nAprendizados recentes internos da VAMO:\n${recentLearning}` : ''}`,
        },
        {
          role: 'user',
          content: `Lead: ${diagnostic.lead_name || '-'} | Empresa: ${diagnostic.company_name || '-'} | Cargo: ${diagnostic.role || '-'}

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
    console.error('[OpenAI] Falha no relatorio final:', error.message);
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
    summary: 'Ainda ha poucos diagnosticos finalizados para gerar aprendizados confiaveis.',
  };

  if (!diagnostics.length) return emptyFallback;

  const openai = getOpenAIClient();
  if (!openai) {
    return {
      ...emptyFallback,
      summary: `Foram encontrados ${diagnostics.length} diagnosticos, mas a chave de IA nao esta configurada. Analise manual recomendada.`,
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
          content: `Voce e a inteligencia estrategica interna da VAMO.
Analise diagnosticos comerciais finalizados e encontre padroes para melhorar perguntas, classificacao de leads, abordagem comercial, copy, argumentos de venda e segmentos com maior fit.
Retorne JSON valido com:
recurring_patterns, best_segments, common_objections, question_improvements, prompt_improvements, sales_insights, summary.
Nao invente padroes sem base. Se houver poucos diagnosticos, deixe claro que os sinais ainda sao fracos.`,
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
    console.error('[OpenAI] Falha no aprendizado diario:', error.message);
    return {
      ...emptyFallback,
      summary: `A rotina encontrou ${diagnostics.length} diagnosticos, mas a IA falhou. Sinais salvos para nova analise.`,
    };
  }
}
