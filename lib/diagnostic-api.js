import { createClient } from '@supabase/supabase-js';
import {
  answerToText,
  getAdaptiveMessage,
  getCompletionProgress,
  getFirstQuestion,
  getNextQuestion,
  getProgress,
  getQuestion,
  hasRequiredSlots,
  toPublicQuestion,
} from './diagnostic-questions.js';
import { generateBlockInsight, generateDailyLearning, generateFinalReport } from './diagnostic-ai.js';

function env(name, fallbackName) {
  return process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
}

export function createSupabaseServerClient() {
  const url = env('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Configure SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente server-side.');
  }
  return createClient(url, key);
}

function requireString(value, field) {
  if (!value || !String(value).trim()) throw new Error(`Campo obrigatório: ${field}.`);
  return String(value).trim();
}

function normalizeWhatsapp(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    throw new Error('Informe um WhatsApp válido com DDD.');
  }
  return digits;
}

function toPublicReport(report = {}) {
  const {
    fit_vertice_score,
    recomendacao_comercial,
    ...publicReport
  } = report;
  return publicReport;
}

async function insertMessage(supabase, diagnosticId, message) {
  const { error } = await supabase.from('diagnostic_messages').insert({
    diagnostic_id: diagnosticId,
    sender: message.sender,
    message: message.message,
    answer_type: message.answer_type || null,
    step: message.step || null,
    metadata: message.metadata || {},
  });
  if (error) throw new Error(`Erro ao salvar mensagem: ${error.message}`);
}

async function fetchDiagnostic(supabase, diagnosticId) {
  const { data, error } = await supabase
    .from('diagnostics')
    .select('*')
    .eq('id', diagnosticId)
    .single();

  if (error || !data) throw new Error('Diagnóstico não encontrado.');
  return data;
}

async function getRecentLearningContext(supabase) {
  const { data, error } = await supabase
    .from('daily_ai_learning')
    .select('summary, recurring_patterns, question_improvements, prompt_improvements, sales_insights, recommended_structure_patterns, created_at')
    .order('created_at', { ascending: false })
    .limit(7);

  if (error || !data?.length) return '';
  return data
    .map((item) => [
      item.summary,
      ...(item.recurring_patterns || []),
      ...(item.question_improvements || []),
      ...(item.prompt_improvements || []),
      ...(item.sales_insights || []),
      ...(item.recommended_structure_patterns || []),
    ].filter(Boolean).slice(0, 5).join(' | '))
    .filter(Boolean)
    .join('\n')
    .slice(0, 1800);
}

export async function startDiagnostic(payload = {}) {
  const leadName = requireString(payload.lead_name, 'lead_name');
  const companyName = requireString(payload.company_name, 'company_name');
  const role = requireString(payload.role, 'role');
  const supabase = createSupabaseServerClient();
  const firstQuestion = getFirstQuestion();

  const { data, error } = await supabase
    .from('diagnostics')
    .insert({
      lead_name: leadName,
      company_name: companyName,
      role,
      current_step: firstQuestion.id,
      status: 'started',
      raw_answers: {},
    })
    .select('id')
    .single();

  if (error) throw new Error(`Erro ao iniciar diagnóstico: ${error.message}`);

  const intro = `Oi, ${leadName.split(' ')[0]}. Vou construir seu Mapa do Ponto Crítico da Operação Comercial. Em poucos minutos, vou entender como sua operação funciona hoje, onde processos, dados e execução podem estar desconectados, e qual frente deveria ser priorizada. Tecnologia e automação entram depois do diagnóstico, não antes.`;
  const publicFirstQuestion = toPublicQuestion(firstQuestion, {});
  const questionMessage = publicFirstQuestion.question;

  await insertMessage(supabase, data.id, {
    sender: 'assistant',
    message: intro,
    step: 'intro',
    metadata: { kind: 'intro' },
  });
  await insertMessage(supabase, data.id, {
    sender: 'assistant',
    message: questionMessage,
    step: firstQuestion.id,
    metadata: publicFirstQuestion,
  });

  return {
    diagnostic_id: data.id,
    messages: [
      { sender: 'assistant', message: intro, metadata: { kind: 'intro' } },
      { sender: 'assistant', message: questionMessage, metadata: publicFirstQuestion },
    ],
    question: publicFirstQuestion,
    progress: getProgress(firstQuestion.id, {}),
  };
}

export async function receiveDiagnosticMessage(payload = {}) {
  const diagnosticId = requireString(payload.diagnostic_id, 'diagnostic_id');
  const step = requireString(payload.step, 'step');
  const answer = payload.answer;
  const answerType = payload.answer_type || 'button';
  const question = getQuestion(step);
  if (!question) throw new Error('Etapa inválida do diagnóstico.');
  if (answer == null || answerToText(answer).trim().length === 0) throw new Error('Resposta vazia.');

  const supabase = createSupabaseServerClient();
  const diagnostic = await fetchDiagnostic(supabase, diagnosticId);
  if (diagnostic.status === 'completed') throw new Error('Diagnóstico já finalizado.');

  const rawAnswers = { ...(diagnostic.raw_answers || {}), [step]: answer };
  const updates = {
    raw_answers: rawAnswers,
    current_step: step,
    updated_at: new Date().toISOString(),
    status: 'in_progress',
  };

  if (question.column) updates[question.column] = answerToText(answer);
  if (question.type === 'contact') {
    updates.whatsapp = normalizeWhatsapp(answer.whatsapp || diagnostic.whatsapp);
    updates.email = answer.email || diagnostic.email || null;
    updates.consent_contact = true;
  }

  await insertMessage(supabase, diagnosticId, {
    sender: 'user',
    message: answerToText(answer),
    answer_type: answerType,
    step,
    metadata: { answer },
  });

  const nextQuestion = getNextQuestion(step, rawAnswers);
  const assistantMessages = [];
  const adaptiveMessage = getAdaptiveMessage(step, rawAnswers);

  if (adaptiveMessage) {
    await insertMessage(supabase, diagnosticId, {
      sender: 'assistant',
      message: adaptiveMessage,
      step: `${step}_adaptive`,
      metadata: { kind: 'insight', adaptive: true },
    });
    assistantMessages.push({ sender: 'assistant', message: adaptiveMessage, metadata: { kind: 'insight', adaptive: true } });
  }

  const canGenerateBlockInsight = question.type !== 'contact';

  if (canGenerateBlockInsight && question.endsBlock) {
    const recentLearning = await getRecentLearningContext(supabase);
    const insight = await generateBlockInsight({
      blockId: question.blockId,
      answers: rawAnswers,
      recentLearning,
    });
    await insertMessage(supabase, diagnosticId, {
      sender: 'assistant',
      message: insight,
      step: `${question.blockId}_insight`,
      metadata: { kind: 'insight', blockId: question.blockId },
    });
    assistantMessages.push({ sender: 'assistant', message: insight, metadata: { kind: 'insight', blockId: question.blockId } });
  }

  if (nextQuestion) {
    updates.current_step = nextQuestion.id;
    const publicNextQuestion = toPublicQuestion(nextQuestion, rawAnswers);
    await insertMessage(supabase, diagnosticId, {
      sender: 'assistant',
      message: publicNextQuestion.question,
      step: nextQuestion.id,
      metadata: publicNextQuestion,
    });
    assistantMessages.push({ sender: 'assistant', message: publicNextQuestion.question, metadata: publicNextQuestion });
  } else {
    updates.current_step = 'ready_to_finalize';
    assistantMessages.push({
      sender: 'assistant',
      message: 'Perfeito. Vou consolidar suas respostas e gerar o Mapa do Ponto Crítico da Operação Comercial.',
      metadata: { kind: 'finalizing' },
    });
    await insertMessage(supabase, diagnosticId, {
      sender: 'assistant',
      message: 'Perfeito. Vou consolidar suas respostas e gerar o Mapa do Ponto Crítico da Operação Comercial.',
      step: 'ready_to_finalize',
      metadata: { kind: 'finalizing' },
    });
  }

  const { error } = await supabase
    .from('diagnostics')
    .update(updates)
    .eq('id', diagnosticId);
  if (error) throw new Error(`Erro ao atualizar diagnóstico: ${error.message}`);

  return {
    diagnostic_id: diagnosticId,
    assistant_messages: assistantMessages,
    question: toPublicQuestion(nextQuestion, rawAnswers),
    complete: !nextQuestion,
    progress: nextQuestion ? getProgress(nextQuestion.id, rawAnswers) : getCompletionProgress(),
  };
}

export async function finalizeDiagnostic(payload = {}) {
  const diagnosticId = requireString(payload.diagnostic_id || payload.id, 'diagnostic_id');
  const supabase = createSupabaseServerClient();
  const diagnostic = await fetchDiagnostic(supabase, diagnosticId);

  if (!diagnostic.raw_answers || !hasRequiredSlots(diagnostic.raw_answers) || !diagnostic.raw_answers.contact_capture) {
    throw new Error('Diagnostico incompleto. Responda as etapas antes de finalizar.');
  }

  if (diagnostic.status === 'completed' && diagnostic.final_report && Object.keys(diagnostic.final_report).length) {
    return { diagnostic_id: diagnosticId, report: toPublicReport(diagnostic.final_report) };
  }

  const recentLearning = await getRecentLearningContext(supabase);
  const report = await generateFinalReport({ diagnostic, recentLearning });

  const updatePayload = {
    status: 'completed',
    current_step: 'completed',
    score_maturidade_operacional: report.score_maturidade_operacional || report.score_previsibilidade,
    score_fit_vertice: report.fit_vertice_score,
    maturity_level: report.nivel_operacao,
    main_critical_points: report.pontos_criticos,
    contradictions: report.contradicoes,
    pillar_scores: report.scores_pilares,
    final_report: report,
    recommended_next_step: report.recomendacao_comercial,
    recommended_structure: report.estrutura_recomendada?.nome || null,
    urgency_level: diagnostic.raw_answers?.implementation_priority || diagnostic.raw_answers?.implementation_urgency || diagnostic.raw_answers?.urgency || null,
    critical_point_category: report.pontos_criticos?.[0]?.titulo || null,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabase
    .from('diagnostics')
    .update(updatePayload)
    .eq('id', diagnosticId);

  if (error && /recommended_structure|urgency_level|critical_point_category|main_critical_points|score_maturidade_operacional/i.test(error.message || '')) {
    const { recommended_structure, urgency_level, critical_point_category, main_critical_points, score_maturidade_operacional, ...legacyPayload } = updatePayload;
    const retry = await supabase
      .from('diagnostics')
      .update(legacyPayload)
      .eq('id', diagnosticId);
    error = retry.error;
  }

  if (error) throw new Error(`Erro ao salvar relatório final: ${error.message}`);

  await insertMessage(supabase, diagnosticId, {
    sender: 'assistant',
    message: report.resumo_executivo,
    step: 'final_report',
    metadata: { kind: 'report', report },
  });

  return { diagnostic_id: diagnosticId, report: toPublicReport(report) };
}

export async function getDiagnosticReport(payload = {}) {
  const diagnosticId = requireString(payload.id || payload.diagnostic_id, 'diagnostic_id');
  const supabase = createSupabaseServerClient();
  const diagnostic = await fetchDiagnostic(supabase, diagnosticId);
  if (diagnostic.status !== 'completed') throw new Error('Diagnóstico ainda não foi finalizado.');
  return {
    diagnostic_id: diagnosticId,
    status: diagnostic.status,
    report: toPublicReport(diagnostic.final_report),
  };
}

export async function runDailyLearning(payload = {}, headers = {}) {
  const expectedSecret = process.env.INTERNAL_CRON_SECRET;
  const providedSecret = payload.secret || headers['x-internal-cron-secret'] || headers['X-Internal-Cron-Secret'];
  if (!expectedSecret) {
    const error = new Error('INTERNAL_CRON_SECRET não configurado.');
    error.statusCode = 500;
    throw error;
  }
  if (providedSecret !== expectedSecret) {
    const error = new Error('Não autorizado.');
    error.statusCode = 401;
    throw error;
  }

  const supabase = createSupabaseServerClient();
  const { data: lastLearning } = await supabase
    .from('daily_ai_learning')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const since = lastLearning?.created_at || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('diagnostics')
    .select('company_name, role, segment, seller_count, business_model, commercial_process_clarity, opportunity_handling, sales_bottleneck, next_step_discipline, management_visibility, commercial_routine, process_technology_adoption, implementation_priority, raw_answers, score_maturidade_operacional, score_fit_vertice, recommended_next_step, final_report, completed_at')
    .eq('status', 'completed')
    .gte('completed_at', since)
    .order('completed_at', { ascending: false })
    .limit(100);

  if (error) throw new Error(`Erro ao buscar diagnósticos: ${error.message}`);

  const learning = await generateDailyLearning({ diagnostics: data || [] });
  const learningPayload = {
    diagnostics_analyzed: data?.length || 0,
    recurring_patterns: learning.recurring_patterns || [],
    best_segments: learning.best_segments || [],
    common_objections: learning.common_objections || [],
    question_improvements: learning.question_improvements || [],
    prompt_improvements: learning.prompt_improvements || [],
    sales_insights: learning.sales_insights || [],
    recommended_structure_patterns: learning.recommended_structure_patterns || [],
    summary: learning.summary || '',
  };
  let { error: insertError } = await supabase.from('daily_ai_learning').insert(learningPayload);
  if (insertError && /recommended_structure_patterns/i.test(insertError.message || '')) {
    const { recommended_structure_patterns, ...legacyPayload } = learningPayload;
    const retry = await supabase.from('daily_ai_learning').insert(legacyPayload);
    insertError = retry.error;
  }

  if (insertError) throw new Error(`Erro ao salvar aprendizado: ${insertError.message}`);

  return {
    diagnostics_analyzed: data?.length || 0,
    since,
    learning,
  };
}
