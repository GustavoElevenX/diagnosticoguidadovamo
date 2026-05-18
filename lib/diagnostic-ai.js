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

Sua função é conduzir uma leitura consultiva sobre vazamentos comerciais, não vender ferramenta.

A VAMO identifica onde a operação comercial está perdendo vendas e implanta a estrutura para corrigir isso com processo, IA, automações, sistemas e acompanhamento.

Regras:
- Escreva em português brasileiro.
- Seja direto, consultivo e específico.
- No máximo 55 palavras.
- Não use markdown.
- Não fale como chatbot genérico.
- Não venda sistema, CRM, bot, automação ou IA.
- Não cite comissão, comissionamento, gamificação ou ranking.
- Comece pelo problema comercial, não pela tecnologia.
- Trate IA como meio, nunca como promessa principal.
- Mostre sinais de vazamento: processo sem padrão, baixa velocidade, perda de contexto, ausência de próxima ação, baixa visibilidade, rotina fraca, adoção baixa.
- Não ensine o cliente a construir sozinho.
- Não faça perguntas extras.${recentLearning ? `\n\nAprendizados recentes internos:\n${recentLearning}` : ''}`,
        },
        {
          role: 'user',
          content: `Bloco: ${block?.title || blockId}\nRespostas até agora:\n${answersSummary(answers)}\n\nGere 1 parágrafo com no máximo 55 palavras.`,
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

Sua função é gerar o relatório final do Mapa de Vazamento de Vendas.

A VAMO não vende IA isolada, bot, CRM, dashboard, automação solta, código ou software avulso.
A VAMO identifica onde a operação comercial está perdendo vendas e implanta a estrutura para corrigir isso com processo, IA, automações, sistemas e acompanhamento.

Tese central:
- Empresas não perdem venda só por falta de lead.
- Perdem por falta de processo, velocidade, acompanhamento, visibilidade, padrão de execução e inteligência operacional.
- IA sem processo acelera a bagunça.
- Ferramenta sem adoção vira mais uma tela.
- A IA entra depois do diagnóstico, não antes.

Regras obrigatórias:
- Comece pelo problema comercial.
- Não comece por IA, CRM, bot, automação ou ferramenta.
- Não cite comissão, comissionamento, gamificação, ranking ou remuneração variável.
- Não prometa aumento de faturamento.
- Não invente números financeiros.
- Não faça perguntas novas.
- Não ensine o cliente a construir a solução sozinho.
- Mostre o custo de construir errado.
- Retorne exatamente 3 vazamentos principais.
- Cada vazamento deve ter causa provável e impacto comercial.
- Recomende uma estrutura VAMO como primeira frente provável de implantação.
- A recomendação deve parecer estratégica, não venda direta.
- Retorne somente JSON válido, sem markdown.

Formato obrigatório:
{
  "score_previsibilidade_comercial": numero de 0 a 100,
  "nivel_operacao": string,
  "resumo_executivo": string,
  "diagnostico_central": string,
  "scores_pilares": {
    "clareza_processo_comercial": numero de 0 a 100,
    "aproveitamento_oportunidades": numero de 0 a 100,
    "continuidade_comercial": numero de 0 a 100,
    "visibilidade_gestao": numero de 0 a 100,
    "rotina_previsibilidade": numero de 0 a 100,
    "adocao_operacional": numero de 0 a 100,
    "prioridade_implantacao": numero de 0 a 100
  },
  "vazamentos": [
    {
      "titulo": string,
      "explicacao": string,
      "impacto": string,
      "prioridade": "alta" | "media" | "baixa"
    }
  ],
  "contradicoes": array de strings,
  "estrutura_recomendada": {
    "nome": string,
    "tipo": string,
    "motivo": string,
    "proximo_passo": string
  },
  "por_que_nao_comecar_pela_ferramenta": string,
  "plano_acao": array com 3 passos objetivos,
  "fit_vamo_score": numero de 0 a 100,
  "recomendacao_comercial": "reunião imediata" | "nutrição estratégica" | "sem fit agora",
  "mensagem_cta": string
}

Estruturas VAMO disponíveis:
- Diagnóstico e Priorização VAMO
- Motor de Prospecção
- Agente Qualificador
- CRM Vivo / Camada de Inteligência do Funil
- Máquina de Follow-up
- Proposta Inteligente
- Copiloto do Gestor
- Motor de Expansão

Use os scores determinísticos como base, mas ajuste levemente se as respostas indicarem risco maior ou menor.${recentLearning ? `\n\nAprendizados recentes internos da VAMO:\n${recentLearning}` : ''}`,
        },
        {
          role: 'user',
          content: `Lead: ${diagnostic.lead_name || '-'} | Empresa: ${diagnostic.company_name || '-'} | Cargo: ${diagnostic.role || '-'} | Modelo de venda: ${diagnostic.business_model || diagnostic.raw_answers?.business_model || diagnostic.segment || diagnostic.raw_answers?.segment || '-'}

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
- etapas do processo com maior perda;
- motivos de baixa previsibilidade;
- estruturas VAMO mais recomendadas;
- segmentos/modelos de venda com maior fit;
- respostas que indicam falta de processo antes de tecnologia;
- sinais de urgência real;
- objeções prováveis relacionadas a ferramenta pronta, ChatGPT, CRM ou automação;
- respostas contraditórias;
- perguntas com possível abandono;
- melhorias para encurtar o diagnóstico sem perder precisão.

Não analise comissão, comissionamento, incentivo, ranking, gamificação ou vendedor individual como eixo do diagnóstico.

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
            business_model: item.business_model || item.raw_answers?.business_model,
            commercial_process_clarity: item.commercial_process_clarity || item.raw_answers?.commercial_process_clarity,
            management_visibility: item.management_visibility || item.raw_answers?.management_visibility,
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
