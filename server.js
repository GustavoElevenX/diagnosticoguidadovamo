import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  finalizeDiagnostic,
  getDiagnosticReport,
  receiveDiagnosticMessage,
  runDailyLearning,
  startDiagnostic,
} from './lib/diagnostic-api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function asyncRoute(handler) {
  return async (req, res) => {
    try {
      const data = await handler(req);
      res.json(data);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      console.error('[API]', error.message);
      res.status(statusCode).json({ error: error.message });
    }
  };
}

app.get('/api/config', (req, res) => {
  res.json({
    whatsappNumber: process.env.NEXT_PUBLIC_VERTICE_WHATSAPP_NUMBER || process.env.VERTICE_WHATSAPP_NUMBER || '',
  });
});

app.post('/api/diagnostico/start', asyncRoute((req) => startDiagnostic(req.body)));
app.post('/api/diagnostico/message', asyncRoute((req) => receiveDiagnosticMessage(req.body)));
app.post('/api/diagnostico/finalize', asyncRoute((req) => finalizeDiagnostic(req.body)));
app.get('/api/diagnostico/:id/report', asyncRoute((req) => getDiagnosticReport({ id: req.params.id })));
app.post('/api/internal/daily-learning', asyncRoute((req) => runDailyLearning(req.body, req.headers)));

app.get(['/diagnostico', '/mapa-ponto-critico-operacao-comercial'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vértice Mapa do Ponto Crítico da Operação Comercial rodando em http://localhost:${PORT}`);
});
