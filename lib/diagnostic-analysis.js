const LEVELS = [
  { max: 25, label: 'Operacao no escuro' },
  { max: 50, label: 'Operacao reativa' },
  { max: 70, label: 'Operacao parcialmente previsivel' },
  { max: 85, label: 'Operacao gerenciavel' },
  { max: 100, label: 'Operacao escalavel' },
];

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

function optionScore(value, rules, fallback = 50) {
  if (!value) return fallback;
  const normalized = String(value).toLowerCase();
  const found = rules.find(([needle]) => normalized.includes(needle));
  return found ? found[1] : fallback;
}

export function getSellerCountValue(value) {
  if (!value) return 0;
  if (value.includes('21')) return 21;
  if (value.includes('11')) return 11;
  if (value.includes('6')) return 6;
  if (value.includes('3')) return 3;
  if (value.includes('1')) return 1;
  return 0;
}

export function getMaturityLevel(score) {
  return LEVELS.find((level) => score <= level.max)?.label || LEVELS[LEVELS.length - 1].label;
}

export function calculatePillarScores(answers = {}) {
  const previsibilidadeMeta = Math.round((
    optionScore(answers.forecast_clarity, [
      ['sim, com clareza', 92],
      ['mais ou menos', 62],
      ['percebo perto', 34],
      ['nao tenho', 20],
    ]) +
    optionScore(answers.quota_attainment, [
      ['quase todos', 88],
      ['mais da metade', 72],
      ['menos da metade', 46],
      ['poucos', 28],
      ['nao tenho', 24],
    ])
  ) / 2);

  const gestaoPerformance = Math.round((
    optionScore(answers.performance_owner, [
      ['gerente', 78],
      ['coordenador', 74],
      ['proprio dono', 60],
      ['cada vendedor', 32],
      ['ninguem', 18],
    ]) +
    optionScore(answers.underperformance_reason, [
      ['temos clareza', 88],
      ['as vezes', 58],
      ['analisar manualmente', 38],
      ['nao sabemos', 22],
      ['nao acompanhamos', 14],
    ])
  ) / 2);

  const comissaoIncentivo = Math.round((
    optionScore(answers.has_commission, [
      ['sim', 70],
      ['parcialmente', 48],
      ['estruturando', 42],
      ['nao', 25],
    ]) +
    optionScore(answers.commission_calculation, [
      ['crm', 84],
      ['sistema interno', 72],
      ['planilha', 42],
      ['manualmente', 30],
      ['nao temos', 18],
    ]) +
    optionScore(answers.seller_commission_visibility, [
      ['sim, com clareza', 90],
      ['mais ou menos', 58],
      ['so no fechamento', 30],
      ['nao consegue', 18],
      ['nao sei', 25],
    ])
  ) / 3);

  const rotinaAcompanhamento = optionScore(answers.tracking_frequency, [
    ['diariamente', 92],
    ['semanalmente', 76],
    ['quinzenalmente', 54],
    ['fim do mes', 24],
    ['surge problema', 22],
  ]);

  const correcaoIndividual = Math.round((
    optionScore(answers.individual_action_plan, [
      ['estruturado', 88],
      ['as vezes', 58],
      ['conversas pontuais', 38],
      ['nao existe', 16],
      ['nao sei', 22],
    ]) +
    optionScore(answers.has_pdi, [
      ['sim', 82],
      ['parcialmente', 58],
      ['quando ha problema', 36],
      ['nao', 18],
      ['nao sei', 22],
    ]) +
    optionScore(answers.manager_correction_data, [
      ['sim, com clareza', 90],
      ['parcialmente', 58],
      ['analisar manualmente', 34],
      ['nao', 18],
      ['nao sei', 22],
    ])
  ) / 3);

  const aproveitamentoOportunidades = Math.round((
    optionScore(answers.main_loss_area, [
      ['falta de leads', 58],
      ['follow-up', 28],
      ['baixa conversao', 38],
      ['falta de gestao', 30],
      ['sem ritmo', 34],
      ['esquecidos', 22],
      ['nao sei', 24],
    ]) +
    optionScore(answers.lead_followup_loss, [
      ['frequencia', 18],
      ['as vezes', 42],
      ['raramente', 72],
      ['nao sei medir', 32],
      ['nao acontece', 88],
    ])
  ) / 2);

  return {
    previsibilidade_meta: clamp(previsibilidadeMeta),
    gestao_performance: clamp(gestaoPerformance),
    comissao_incentivo: clamp(comissaoIncentivo),
    rotina_acompanhamento: clamp(rotinaAcompanhamento),
    correcao_individual: clamp(correcaoIndividual),
    aproveitamento_oportunidades: clamp(aproveitamentoOportunidades),
  };
}

export function calculatePredictabilityScore(answers = {}) {
  const pillars = calculatePillarScores(answers);
  const urgencyBonus = optionScore(answers.urgency, [
    ['30 dias', 5],
    ['60 dias', 3],
    ['90 dias', 1],
    ['sem previsao', -4],
    ['pesquisando', -6],
  ], 0);

  const score =
    pillars.previsibilidade_meta * 0.22 +
    pillars.gestao_performance * 0.17 +
    pillars.comissao_incentivo * 0.15 +
    pillars.rotina_acompanhamento * 0.17 +
    pillars.correcao_individual * 0.17 +
    pillars.aproveitamento_oportunidades * 0.12 +
    urgencyBonus;

  return clamp(score);
}

export function calculateFitScore(answers = {}) {
  let score = 0;
  const sellers = getSellerCountValue(answers.seller_count);

  if (sellers >= 5) score += 18;
  else if (sellers >= 3) score += 10;

  if (['sim', 'parcialmente', 'estruturando'].some((term) => String(answers.has_commission || '').toLowerCase().includes(term))) score += 12;
  if (String(answers.commission_calculation || '').toLowerCase().includes('planilha') || String(answers.commission_calculation || '').toLowerCase().includes('manual')) score += 12;
  if (!String(answers.forecast_clarity || '').toLowerCase().includes('sim, com clareza')) score += 12;
  if (['whatsapp', 'consultiva', 'ticket alto', 'b2b'].some((term) => `${answers.sales_channel || ''} ${answers.sales_model || ''}`.toLowerCase().includes(term))) score += 10;
  if (!String(answers.underperformance_reason || '').toLowerCase().includes('temos clareza')) score += 10;
  if (['so no fechamento', 'nao consegue', 'mais ou menos'].some((term) => String(answers.seller_commission_visibility || '').toLowerCase().includes(term))) score += 10;
  if (['30 dias', '60 dias'].some((term) => String(answers.urgency || '').toLowerCase().includes(term))) score += 12;
  if (String(answers.main_loss_area || '').toLowerCase().includes('nao sei')) score += 4;

  if (String(answers.urgency || '').toLowerCase().includes('pesquisando')) score -= 15;
  if (sellers < 3) score -= 10;

  return clamp(score);
}

export function classifyCommercialRecommendation(answers = {}, fitScore = 0) {
  const sellers = getSellerCountValue(answers.seller_count);
  const hasUrgency = ['30 dias', '60 dias'].some((term) => String(answers.urgency || '').toLowerCase().includes(term));
  const hasPain = [
    answers.forecast_clarity,
    answers.commission_calculation,
    answers.underperformance_reason,
    answers.main_loss_area,
  ].some((value) => /mais ou menos|percebo|nao|manual|planilha|follow-up|gestao|conversao|esquecidos/i.test(String(value || '')));

  if (fitScore >= 70 && sellers >= 5 && hasUrgency && hasPain) return 'reuniao imediata';
  if (fitScore >= 40) return 'nutricao';
  return 'sem fit';
}

export function detectContradictions(answers = {}) {
  const contradictions = [];
  const tracking = String(answers.tracking_frequency || '').toLowerCase();
  const forecast = String(answers.forecast_clarity || '').toLowerCase();
  const commission = String(answers.has_commission || '').toLowerCase();
  const visibility = String(answers.seller_commission_visibility || '').toLowerCase();
  const owner = String(answers.performance_owner || '').toLowerCase();
  const reason = String(answers.underperformance_reason || '').toLowerCase();

  if ((tracking.includes('diariamente') || tracking.includes('semanalmente')) && (forecast.includes('percebo perto') || forecast.includes('nao tenho'))) {
    contradictions.push('Existe acompanhamento, mas ele parece ser mais retrospectivo do que preditivo. O problema e percebido tarde demais.');
  }

  if ((commission.includes('sim') || commission.includes('parcialmente')) && (visibility.includes('so no fechamento') || visibility.includes('nao consegue'))) {
    contradictions.push('A comissao existe, mas nao esta sendo usada como motor de comportamento durante o mes.');
  }

  if ((owner.includes('gerente') || owner.includes('dono') || owner.includes('coordenador')) && (reason.includes('nao sabemos') || reason.includes('analisar manualmente'))) {
    contradictions.push('Existe alguem responsavel pela performance, mas a leitura individual ainda depende de esforco manual ou chega sem precisao.');
  }

  return contradictions;
}

export function buildLeaks(answers = {}, pillars = calculatePillarScores(answers)) {
  const candidates = [
    {
      title: 'Meta acompanhada tarde demais',
      score: pillars.previsibilidade_meta,
      explanation: 'A operacao nao enxerga com clareza se vai bater meta antes do fechamento.',
      impact: 'O gestor perde tempo de correcao e atua quando parte do mes ja foi consumida.',
    },
    {
      title: 'Comissao pouco conectada ao comportamento',
      score: pillars.comissao_incentivo,
      explanation: 'A regra ou a visibilidade da comissao nao orienta o vendedor durante o mes.',
      impact: 'A comissao vira apenas pagamento, nao instrumento diario de performance.',
    },
    {
      title: 'Gestor sem visao individual clara',
      score: pillars.gestao_performance,
      explanation: 'Quando alguem performa abaixo, o motivo nao aparece rapido o suficiente.',
      impact: 'A correcao depende de analise manual, percepcao ou conversa tardia.',
    },
    {
      title: 'Leads sem acompanhamento consistente',
      score: pillars.aproveitamento_oportunidades,
      explanation: 'Parte das oportunidades pode estar se perdendo por follow-up ou rotina fraca.',
      impact: 'A empresa investe para gerar demanda, mas perde resultado dentro da operacao.',
    },
    {
      title: 'Falta de rotina de correcao semanal',
      score: pillars.correcao_individual,
      explanation: 'PDI, planos individuais ou ajustes de rota ainda nao parecem estruturados.',
      impact: 'Problemas individuais se repetem ate virarem resultado ruim no fechamento.',
    },
  ];

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((item) => ({
      titulo: item.title,
      explicacao: item.explanation,
      impacto: item.impact,
      prioridade: item.score <= 40 ? 'alta' : item.score <= 65 ? 'media' : 'baixa',
    }));
}

export function buildActionPlan(answers = {}, leaks = []) {
  const plan = [];
  const leakTitles = leaks.map((leak) => leak.titulo).join(' | ').toLowerCase();

  if (leakTitles.includes('meta')) plan.push('Definir indicadores semanais por vendedor e acompanhar risco de meta antes do fechamento.');
  if (leakTitles.includes('comissao')) plan.push('Reestruturar a visibilidade da comissao para o vendedor entender, durante o mes, o que precisa fazer.');
  if (leakTitles.includes('gestor') || leakTitles.includes('correcao')) plan.push('Criar uma rotina curta de correcao individual com dados, causa provavel e proxima acao.');
  if (leakTitles.includes('leads')) plan.push('Mapear os pontos de perda depois que o lead chega e travar uma rotina minima de follow-up.');

  while (plan.length < 3) {
    const additions = [
      'Separar o funil por etapa e identificar onde a conversao cai com mais frequencia.',
      'Definir uma reuniao semanal de performance com foco em decisao, nao apenas cobranca.',
      'Padronizar o acompanhamento de meta, comissao e atividade em um unico painel.',
    ];
    const next = additions.find((item) => !plan.includes(item));
    if (!next) break;
    plan.push(next);
  }

  return plan.slice(0, 3);
}

export function buildFallbackReport(diagnostic = {}) {
  const answers = diagnostic.raw_answers || {};
  const pillarScores = calculatePillarScores(answers);
  const score = calculatePredictabilityScore(answers);
  const fitScore = calculateFitScore(answers);
  const leaks = buildLeaks(answers, pillarScores);
  const contradictions = detectContradictions(answers);
  const actionPlan = buildActionPlan(answers, leaks);
  const nextStep = classifyCommercialRecommendation(answers, fitScore);
  const level = getMaturityLevel(score);

  return {
    score_previsibilidade: score,
    nivel_operacao: level,
    resumo_executivo: `Seu Raio-X indica uma operacao em nivel "${level}". Os principais riscos estao ligados a previsibilidade, rotina de correcao e aproveitamento das oportunidades depois que o lead chega.`,
    scores_pilares: pillarScores,
    vazamentos: leaks,
    contradicoes: contradictions,
    plano_acao: actionPlan,
    fit_vamo_score: fitScore,
    recomendacao_comercial: nextStep,
    mensagem_cta: 'A VAMO pode mostrar, em uma conversa de 20 minutos, quais primeiras correcoes podem estruturar meta, comissao e performance sem prometer resultado sem base.',
  };
}

export function normalizeReport(report, diagnostic = {}) {
  const fallback = buildFallbackReport(diagnostic);
  const normalized = {
    ...fallback,
    ...report,
    scores_pilares: {
      ...fallback.scores_pilares,
      ...(report?.scores_pilares || {}),
    },
  };

  normalized.score_previsibilidade = clamp(normalized.score_previsibilidade);
  normalized.fit_vamo_score = clamp(normalized.fit_vamo_score);
  normalized.nivel_operacao = normalized.nivel_operacao || getMaturityLevel(normalized.score_previsibilidade);
  normalized.vazamentos = Array.isArray(normalized.vazamentos) && normalized.vazamentos.length ? normalized.vazamentos.slice(0, 5) : fallback.vazamentos;
  normalized.contradicoes = Array.isArray(normalized.contradicoes) ? normalized.contradicoes : fallback.contradicoes;
  normalized.plano_acao = Array.isArray(normalized.plano_acao) && normalized.plano_acao.length ? normalized.plano_acao.slice(0, 3) : fallback.plano_acao;
  normalized.recomendacao_comercial = ['reuniao imediata', 'nutricao', 'sem fit'].includes(normalized.recomendacao_comercial)
    ? normalized.recomendacao_comercial
    : classifyCommercialRecommendation(diagnostic.raw_answers || {}, normalized.fit_vamo_score);

  return normalized;
}
