const LEVELS = [
  { max: 25, label: 'Operação no escuro' },
  { max: 50, label: 'Operação reativa' },
  { max: 70, label: 'Operação parcialmente previsível' },
  { max: 85, label: 'Operação gerenciável' },
  { max: 100, label: 'Operação escalável' },
];

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));
const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function optionScore(value, rules, fallback = 50) {
  if (!value) return fallback;
  const normalized = normalize(value);
  const found = rules.find(([needle]) => normalized.includes(normalize(needle)));
  return found ? found[1] : fallback;
}

export function getSellerCountValue(value) {
  const normalized = normalize(value);
  if (normalized.includes('21')) return 21;
  if (normalized.includes('11')) return 11;
  if (normalized.includes('6')) return 6;
  if (normalized.includes('3')) return 3;
  if (normalized.includes('1')) return 1;
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
      ['não tenho', 20],
    ]) +
    optionScore(answers.quota_attainment, [
      ['quase todos', 88],
      ['mais da metade', 72],
      ['menos da metade', 46],
      ['poucos', 28],
      ['não tenho', 24],
    ])
  ) / 2);

  const gestaoPerformance = Math.round((
    optionScore(answers.performance_owner, [
      ['gerente', 78],
      ['coordenador', 74],
      ['próprio dono', 60],
      ['cada vendedor', 32],
      ['ninguém', 18],
    ]) +
    optionScore(answers.underperformance_reason, [
      ['temos clareza', 88],
      ['às vezes', 58],
      ['analisar manualmente', 38],
      ['não sabemos', 22],
      ['não acompanhamos', 14],
    ])
  ) / 2);

  const comissaoIncentivo = Math.round((
    optionScore(answers.has_commission, [
      ['sim', 70],
      ['parcialmente', 48],
      ['estruturando', 42],
      ['não', 25],
    ]) +
    optionScore(answers.commission_calculation, [
      ['crm', 84],
      ['sistema interno', 72],
      ['planilha', 42],
      ['manualmente', 30],
      ['não temos', 18],
    ]) +
    optionScore(answers.seller_commission_visibility, [
      ['sim, com clareza', 90],
      ['mais ou menos', 58],
      ['só no fechamento', 30],
      ['não consegue', 18],
      ['não sei', 25],
    ])
  ) / 3);

  const rotinaAcompanhamento = optionScore(answers.tracking_frequency, [
    ['diariamente', 92],
    ['semanalmente', 76],
    ['quinzenalmente', 54],
    ['fim do mês', 24],
    ['surge problema', 22],
  ]);

  const correcaoIndividual = Math.round((
    optionScore(answers.individual_action_plan, [
      ['estruturado', 88],
      ['às vezes', 58],
      ['conversas pontuais', 38],
      ['não existe', 16],
      ['não sei', 22],
    ]) +
    optionScore(answers.has_pdi, [
      ['sim', 82],
      ['parcialmente', 58],
      ['quando há problema', 36],
      ['não', 18],
      ['não sei', 22],
    ]) +
    optionScore(answers.manager_correction_data, [
      ['sim, com clareza', 90],
      ['parcialmente', 58],
      ['analisar manualmente', 34],
      ['não', 18],
      ['não sei', 22],
    ])
  ) / 3);

  const aproveitamentoOportunidades = Math.round((
    optionScore(answers.main_loss_area, [
      ['falta de leads', 58],
      ['follow-up', 28],
      ['baixa conversão', 38],
      ['falta de gestão', 30],
      ['sem ritmo', 34],
      ['esquecidos', 22],
      ['não sei', 24],
    ]) +
    optionScore(answers.lead_followup_loss, [
      ['frequência', 18],
      ['às vezes', 42],
      ['raramente', 72],
      ['não sei medir', 32],
      ['não acontece', 88],
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
    ['sem previsão', -4],
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

  if (['sim', 'parcialmente', 'estruturando'].some((term) => normalize(answers.has_commission).includes(term))) score += 12;
  if (normalize(answers.commission_calculation).includes('planilha') || normalize(answers.commission_calculation).includes('manual')) score += 12;
  if (!normalize(answers.forecast_clarity).includes('sim, com clareza')) score += 12;
  if (['whatsapp', 'consultiva', 'ticket alto', 'b2b'].some((term) => normalize(`${answers.sales_channel || ''} ${answers.sales_model || ''}`).includes(term))) score += 10;
  if (!normalize(answers.underperformance_reason).includes('temos clareza')) score += 10;
  if (['so no fechamento', 'nao consegue', 'mais ou menos'].some((term) => normalize(answers.seller_commission_visibility).includes(term))) score += 10;
  if (['30 dias', '60 dias'].some((term) => normalize(answers.urgency).includes(term))) score += 12;
  if (normalize(answers.main_loss_area).includes('nao sei')) score += 4;

  if (normalize(answers.urgency).includes('pesquisando')) score -= 15;
  if (sellers < 3) score -= 10;

  return clamp(score);
}

export function classifyCommercialRecommendation(answers = {}, fitScore = 0) {
  const sellers = getSellerCountValue(answers.seller_count);
  const hasUrgency = ['30 dias', '60 dias'].some((term) => normalize(answers.urgency).includes(term));
  const hasPain = [
    answers.forecast_clarity,
    answers.commission_calculation,
    answers.underperformance_reason,
    answers.main_loss_area,
  ].some((value) => /mais ou menos|percebo|nao|manual|planilha|follow-up|gestao|conversao|esquecidos/i.test(normalize(value)));

  if (fitScore >= 70 && sellers >= 5 && hasUrgency && hasPain) return 'reunião imediata';
  if (fitScore >= 40) return 'nutrição';
  return 'sem fit';
}

export function detectContradictions(answers = {}) {
  const contradictions = [];
  const tracking = normalize(answers.tracking_frequency);
  const forecast = normalize(answers.forecast_clarity);
  const commission = normalize(answers.has_commission);
  const visibility = normalize(answers.seller_commission_visibility);
  const owner = normalize(answers.performance_owner);
  const reason = normalize(answers.underperformance_reason);

  if ((tracking.includes('diariamente') || tracking.includes('semanalmente')) && (forecast.includes('percebo perto') || forecast.includes('nao tenho'))) {
    contradictions.push('Existe acompanhamento, mas ele parece ser mais retrospectivo do que preditivo. O problema é percebido tarde demais.');
  }

  if ((commission.includes('sim') || commission.includes('parcialmente')) && (visibility.includes('so no fechamento') || visibility.includes('nao consegue'))) {
    contradictions.push('A comissão existe, mas não está sendo usada como motor de comportamento durante o mês.');
  }

  if ((owner.includes('gerente') || owner.includes('dono') || owner.includes('coordenador')) && (reason.includes('nao sabemos') || reason.includes('analisar manualmente'))) {
    contradictions.push('Existe alguém responsável pela performance, mas a leitura individual ainda depende de esforço manual ou chega sem precisão.');
  }

  return contradictions;
}

export function buildLeaks(answers = {}, pillars = calculatePillarScores(answers)) {
  const hasNoCommission = normalize(answers.has_commission) === 'nao';
  const candidates = [
    {
      title: 'Meta acompanhada tarde demais',
      score: pillars.previsibilidade_meta,
      explanation: 'A operação não enxerga com clareza se vai bater meta antes do fechamento.',
      impact: 'O gestor perde tempo de correção e atua quando parte do mês já foi consumida.',
    },
    {
      title: hasNoCommission ? 'Modelo de incentivo comercial pouco estruturado' : 'Comissão pouco conectada ao comportamento',
      score: pillars.comissao_incentivo,
      explanation: hasNoCommission
        ? 'A operação não utiliza comissão ou incentivo claro para orientar comportamento comercial durante o mês.'
        : 'A regra ou a visibilidade da comissão não orienta o vendedor durante o mês.',
      impact: hasNoCommission
        ? 'O time pode depender mais de cobrança manual do que de estímulos conectados à meta e performance.'
        : 'A comissão vira apenas pagamento, não instrumento diário de performance.',
    },
    {
      title: 'Gestor sem visão individual clara',
      score: pillars.gestao_performance,
      explanation: 'Quando alguém performa abaixo, o motivo não aparece rápido o suficiente.',
      impact: 'A correção depende de análise manual, percepção ou conversa tardia.',
    },
    {
      title: 'Leads sem acompanhamento consistente',
      score: pillars.aproveitamento_oportunidades,
      explanation: 'Parte das oportunidades pode estar se perdendo por follow-up ou rotina fraca.',
      impact: 'A empresa investe para gerar demanda, mas perde resultado dentro da operação.',
    },
    {
      title: 'Falta de rotina de correção semanal',
      score: pillars.correcao_individual,
      explanation: 'PDI, planos individuais ou ajustes de rota ainda não parecem estruturados.',
      impact: 'Problemas individuais se repetem até virarem resultado ruim no fechamento.',
    },
  ];

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((item) => ({
      titulo: item.title,
      explicacao: item.explanation,
      impacto: item.impact,
      prioridade: item.score <= 40 ? 'alta' : item.score <= 65 ? 'média' : 'baixa',
    }));
}

export function buildActionPlan(answers = {}, leaks = []) {
  const plan = [];
  const leakTitles = normalize(leaks.map((leak) => leak.titulo).join(' | '));

  if (leakTitles.includes('meta')) plan.push('Definir indicadores semanais por vendedor e acompanhar risco de meta antes do fechamento.');
  if (leakTitles.includes('comissao')) plan.push('Reestruturar a visibilidade da comissão para o vendedor entender, durante o mês, o que precisa fazer.');
  if (leakTitles.includes('gestor') || leakTitles.includes('correcao')) plan.push('Criar uma rotina curta de correção individual com dados, causa provável e próxima ação.');
  if (leakTitles.includes('leads')) plan.push('Mapear os pontos de perda depois que o lead chega e travar uma rotina mínima de follow-up.');

  while (plan.length < 3) {
    const additions = [
      'Separar o funil por etapa e identificar onde a conversão cai com mais frequência.',
      'Definir uma reunião semanal de performance com foco em decisão, não apenas cobrança.',
      'Padronizar o acompanhamento de meta, comissão e atividade em um único painel.',
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
    resumo_executivo: `Seu Mapa de Previsibilidade indica uma operação em nível "${level}". Os principais riscos estão ligados a previsibilidade, rotina de correção e aproveitamento das oportunidades depois que o lead chega.`,
    scores_pilares: pillarScores,
    vazamentos: leaks,
    contradicoes: contradictions,
    plano_acao: actionPlan,
    fit_vamo_score: fitScore,
    recomendacao_comercial: nextStep,
    mensagem_cta: 'A VAMO pode mostrar, em uma conversa de 20 minutos, quais primeiras correções podem estruturar meta, comissão e performance sem prometer resultado sem base.',
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
  normalized.recomendacao_comercial = ['reunião imediata', 'nutrição', 'sem fit', 'reuniao imediata', 'nutricao'].includes(normalized.recomendacao_comercial)
    ? normalized.recomendacao_comercial.replace('reuniao', 'reunião').replace('nutricao', 'nutrição')
    : classifyCommercialRecommendation(diagnostic.raw_answers || {}, normalized.fit_vamo_score);

  return normalized;
}
