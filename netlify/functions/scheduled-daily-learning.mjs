import { runDailyLearning } from '../../lib/diagnostic-api.js';

export default async () => {
  const result = await runDailyLearning({
    secret: process.env.INTERNAL_CRON_SECRET,
  });

  console.log('[Vértice daily learning]', JSON.stringify({
    diagnostics_analyzed: result.diagnostics_analyzed,
    since: result.since,
  }));
};

export const config = {
  schedule: '0 9 * * *',
};
