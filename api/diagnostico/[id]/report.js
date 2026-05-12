import { getDiagnosticReport } from '../../../lib/diagnostic-api.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  try {
    const data = await getDiagnosticReport({ id: req.query.id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ error: error.message });
  }
}
