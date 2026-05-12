import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PIXEL_ID   = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;

// ── Helpers ──────────────────────────────────────────────────
function sha256(v) {
  return createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

function normalizePhone(raw) {
  const d = raw.replace(/\D/g, '');
  return d.startsWith('55') ? d : `55${d}`;
}

async function sendCapiEvent({ eventName, eventId, userData, ip, userAgent, sourceUrl }) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    console.warn('[Meta CAPI] Variáveis não configuradas.');
    return;
  }
  const payload = {
    data: [{
      event_name:       eventName,
      event_time:       Math.floor(Date.now() / 1000),
      action_source:    'website',
      event_id:         String(eventId),
      event_source_url: sourceUrl || '',
      user_data: {
        ...userData,
        client_ip_address: ip || '',
        client_user_agent:  userAgent || '',
      },
    }],
  };
  try {
    const res  = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const json = await res.json();
    if (!res.ok) console.error('[Meta CAPI] Erro:', JSON.stringify(json));
    else console.log(`[Meta CAPI] ${eventName} enviado. events_received:`, json.events_received);
  } catch (err) {
    console.error('[Meta CAPI] Falha:', err.message);
  }
}

// ── System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é um especialista em diagnóstico de operações comerciais com mais de 15 anos de experiência estruturando times de vendas em empresas de médio porte no Brasil.

Analise as respostas do gestor e retorne EXCLUSIVAMENTE um objeto JSON válido, sem markdown, sem blocos de código, sem texto fora do JSON.

O JSON deve ter exatamente esta estrutura:

{
  "scores": {
    "gestao_dados": <inteiro 0-10>,
    "previsibilidade": <inteiro 0-10>,
    "independencia_processo": <inteiro 0-10>,
    "engajamento_time": <inteiro 0-10>,
    "saude_funil": <inteiro 0-10>,
    "maturidade_geral": <inteiro 0-10>
  },
  "nivel": "<uma dessas opções exatas: 'Comercial no feeling' | 'Em estruturação' | 'Em crescimento' | 'Comercial maduro'>",
  "pontos_criticos": [
    "<problema crítico 1 em no máximo 8 palavras>",
    "<problema crítico 2 em no máximo 8 palavras>",
    "<problema crítico 3 em no máximo 8 palavras>"
  ],
  "diagnostico": "<4 parágrafos separados por \\n\\n, sem títulos, sem markdown>"
}

Regras para os scores (0 = péssimo, 10 = excelente):
- gestao_dados: qualidade do acompanhamento de resultados
- previsibilidade: capacidade de prever fechamentos
- independencia_processo: o quanto o processo não depende de uma pessoa
- engajamento_time: engajamento e clareza do comissionamento
- saude_funil: ausência de gargalos no funil comercial
- maturidade_geral: média ponderada dos demais com julgamento crítico

Regras para o campo "diagnostico":
- 4 parágrafos separados por \\n\\n
- Parágrafo 1: O retrato real da operação hoje. Direto e cirúrgico.
- Parágrafo 2: O problema raiz que está gerando todos os outros. Nomeie com clareza.
- Parágrafo 3: O que está custando caro agora. Consequência real de negócio.
- Parágrafo 4: O único movimento mais importante a fazer primeiro. Termine com: "Se quiser entender como estruturar isso na prática, o time da VAMO pode fazer isso junto com você."
- Português brasileiro direto, sem jargão de palestra, sem asteriscos
- Use o nome do gestor pelo menos duas vezes
- Nunca use: jornada, ecossistema, sinergia, potencializar, alavancar
- Cada parágrafo com no máximo 5 linhas

Seja honesto. Se o problema é grave, diga que é grave. Não suavize.`;

// ── Handler ───────────────────────────────────────────────────
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido.' }) }; }

  const {
    lead_id, nome, empresa, cargo,
    tamanho, acompanhamento, previsibilidade, dependencia, engajamento, gargalo,
    email, whatsapp, diagnoseEventId,
  } = body;

  if (!lead_id || !nome) {
    return { statusCode: 400, body: JSON.stringify({ error: 'lead_id e nome são obrigatórios.' }) };
  }

  const userPrompt = `Nome: ${nome}
Empresa: ${empresa || '-'}
Cargo: ${cargo || 'não informado'}
Tamanho do time: ${tamanho || '-'}
Como acompanha resultados: ${acompanhamento || '-'}
Previsibilidade de fechamento: ${previsibilidade || '-'}
Dependência de vendedor específico: ${dependencia || '-'}
Engajamento e comissionamento: ${engajamento || '-'}
Principal gargalo percebido: ${gargalo || '-'}`;

  try {
    const completion = await openai.chat.completions.create({
      model:       'gpt-4o',
      max_tokens:  900,
      temperature: 0.75,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userPrompt },
      ],
    });

    const raw    = completion.choices[0].message.content.trim();
    const tokens = completion.usage?.total_tokens || null;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Resposta da IA não é um JSON válido.');
      parsed = JSON.parse(match[0]);
    }

    const { error: dbError } = await supabase.from('diagnosticos').insert({
      lead_id,
      tamanho_time:      tamanho        || null,
      acompanhamento:    acompanhamento || null,
      previsibilidade:   previsibilidade|| null,
      dependencia:       dependencia    || null,
      engajamento:       engajamento    || null,
      gargalo:           gargalo        || null,
      diagnostico_texto: parsed.diagnostico || raw,
      modelo_ia:         'gpt-4o',
      tokens_usados:     tokens,
    });

    if (dbError) console.error('[Supabase] Erro ao salvar diagnóstico:', dbError.message);

    // ── Meta CAPI — CompleteRegistration (fire-and-forget) ───
    if (email && whatsapp) {
      const parts     = nome.trim().toLowerCase().split(' ');
      const phone     = normalizePhone(whatsapp);
      const ip        = (event.headers['x-forwarded-for'] || '').split(',')[0].trim() || event.headers['client-ip'] || '';
      const userAgent = event.headers['user-agent'] || '';
      const sourceUrl = event.headers['referer'] || event.headers['origin'] || '';

      const userData = {
        em: [sha256(email)],
        ph: [sha256(phone)],
        fn: [sha256(parts[0] || '')],
        ...(parts.length > 1 ? { ln: [sha256(parts.slice(1).join(' '))] } : {}),
      };

      sendCapiEvent({
        eventName: 'CompleteRegistration',
        eventId:   diagnoseEventId || lead_id,
        userData,
        ip,
        userAgent,
        sourceUrl,
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    };

  } catch (err) {
    console.error('[OpenAI] Erro:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
