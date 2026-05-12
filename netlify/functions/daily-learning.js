import { runDailyLearning } from '../../lib/diagnostic-api.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const payload = JSON.parse(event.body || '{}');
    const data = await runDailyLearning(payload, event.headers || {});
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: error.statusCode || 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
  }
};
