import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PIXEL_ID   = process.env.META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;

function sha256(v) {
  return createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

function normalizePhone(raw) {
  const d = raw.replace(/\D/g, '');
  return d.startsWith('55') ? d : `55${d}`;
}

async function sendCapiLead({ eventId, userData, ip, userAgent, sourceUrl }) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    console.warn('[Meta CAPI] Variáveis não configuradas.');
    return;
  }
  const payload = {
    data: [{
      event_name:       'Lead',
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
    else console.log('[Meta CAPI] Lead enviado. events_received:', json.events_received);
  } catch (err) {
    console.error('[Meta CAPI] Falha:', err.message);
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido.' }) }; }

  const { nome, whatsapp, email, empresa, cargo, eventId } = body;

  if (!nome || !whatsapp || !email || !empresa) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Campos obrigatórios: nome, whatsapp, email, empresa.' }),
    };
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({ nome, whatsapp, email, empresa, cargo: cargo || null })
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Erro ao salvar lead:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao salvar lead.' }) };
  }

  // ── Meta CAPI — Lead (fire-and-forget) ────────────────────
  const parts  = nome.trim().toLowerCase().split(' ');
  const phone  = normalizePhone(whatsapp);
  const ip         = (event.headers['x-forwarded-for'] || '').split(',')[0].trim() || event.headers['client-ip'] || '';
  const userAgent  = event.headers['user-agent'] || '';
  const sourceUrl  = event.headers['referer'] || event.headers['origin'] || '';

  const userData = {
    em: [sha256(email)],
    ph: [sha256(phone)],
    fn: [sha256(parts[0] || '')],
    ...(parts.length > 1 ? { ln: [sha256(parts.slice(1).join(' '))] } : {}),
  };

  sendCapiLead({ eventId: eventId || data.id, userData, ip, userAgent, sourceUrl });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead_id: data.id }),
  };
};
