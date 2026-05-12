import { getDiagnosticReport } from '../../lib/diagnostic-api.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const id = event.queryStringParameters?.id;
    const data = await getDiagnosticReport({ id });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: error.statusCode || 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error.message }) };
  }
};
