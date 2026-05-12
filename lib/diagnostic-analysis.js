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
  const predictability = answers.predictability_level || answers.forecast_clarity;
  const mainLeak = answers.main_sales_leak || answers.main_loss_area;
  const followupLoss = answers.followup_loss || answers.lead_followup_loss;
  const incentiveModel = answers.incentive_model || answers.has_commission;

  const previsibilidadeMeta = optionScore(predictability, [
      ['sim, com clareza', 92],
      ['mais ou menos', 62],
      ['perto do fechamento', 34],
      ['não tenho', 20],
      ['nao tenho', 20],
    ]);

  const gestaoPerformance = Math.round((
    optionScore(mainLeak, [
      ['falta de gestão', 24],
      ['nao sei', 28],
      ['vendedor sem ritmo', 36],
      ['falta de follow-up', 42],
      ['baixa conversão', 46],
      ['falta de lead', 58],
    ]) +
    optionScore(answers.seller_count, [
      ['21+', 44],
      ['11 a 20', 50],
      ['6 a 10', 58],
      ['3 a 5', 66],
      ['1 a 2', 62],
    ])
  ) / 2);

  const comissaoIncentivo = optionScore(incentiveModel, [
    ['comissão clara', 82],
    ['comissao clara', 82],
    ['premiação', 66],
    ['premiacao', 66],
    ['planilha', 38],
    ['manual', 34],
    ['salário fixo', 28],
    ['salario fixo', 28],
    ['modelo claro', 22],
    ['não temos', 22],
    ['nao temos', 22],
  ]);

  const rotinaAcompanhamento = optionScore(followupLoss, [
    ['não acontece', 88],
    ['nao acontece', 88],
    ['raramente', 72],
    ['às vezes', 46],
    ['as vezes', 46],
    ['não sei medir', 34],
    ['nao sei medir', 34],
    ['frequência', 18],
    ['frequencia', 18],
  ]);

  const correcaoIndividual = Math.round((
    optionScore(mainLeak, [
      ['vendedor sem ritmo', 28],
      ['falta de gestão', 32],
      ['nao sei', 34],
      ['falta de follow-up', 44],
      ['baixa conversão', 48],
      ['falta de lead', 58],
    ]) +
    optionScore(answers.urgency, [
      ['30 dias', 44],
      ['60 dias', 54],
      ['90 dias', 62],
      ['sem previsão', 48],
      ['sem previsao', 48],
      ['pesquisando', 56],
    ])
  ) / 2);

  const aproveitamentoOportunidades = Math.round((
    optionScore(mainLeak, [
      ['falta de leads', 58],
      ['falta de lead', 58],
      ['follow-up', 28],
      ['baixa conversão', 38],
      ['baixa conversao', 38],
      ['falta de gestão', 30],
      ['falta de gestao', 30],
      ['vendedor sem ritmo', 34],
      ['não sei', 24],
      ['nao sei', 24],
    ]) +
    optionScore(followupLoss, [
      ['frequência', 18],
      ['frequencia', 18],
      ['às vezes', 42],
      ['as vezes', 42],
      ['raramente', 72],
      ['não sei medir', 32],
      ['nao sei medir', 32],
      ['não acontece', 88],
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
  const predictability = answers.predictability_level || answers.forecast_clarity;
  const mainLeak = answers.main_sales_leak || answers.main_loss_area;
  const followupLoss = answers.followup_loss || answers.lead_followup_loss;
  const incentiveModel = answers.incentive_model || `${answers.has_commission || ''} ${answers.commission_calculation || ''} ${answers.seller_commission_visibility || ''}`;

  if (sellers >= 5) score += 18;
  else if (sellers >= 3) score += 10;

  if (['frequencia', 'as vezes', 'nao sei medir'].some((term) => normalize(followupLoss).includes(term))) score += 16;
  if (!normalize(predictability).includes('sim, com clareza')) score += 12;
  if (['planilha', 'manual', 'salario fixo', 'modelo claro', 'nao temos'].some((term) => normalize(incentiveModel).includes(term))) score += 14;
  if (['whatsapp', 'crm', 'ligacao', 'consultiva', 'ticket alto', 'b2b'].some((term) => normalize(`${answers.sales_channel || ''} ${answers.sales_model || ''} ${answers.segment || ''}`).includes(term))) score += 10;
  if (['falta de follow-up', 'baixa conversao', 'falta de gestao', 'vendedor sem ritmo', 'nao sei identificar'].some((term) => normalize(mainLeak).includes(term))) score += 10;
  if (['30 dias', '60 dias'].some((term) => normalize(answers.urgency).includes(term))) score += 12;
  if (normalize(mainLeak).includes('nao sei')) score += 8;

  if (normalize(answers.urgency).includes('pesquisando')) score -= 15;
  if (sellers < 3) score -= 10;

  return clamp(score);
}

export function classifyCommercialRecommendation(answers = {}, fitScore = 0) {
  const sellers = getSellerCountValue(answers.seller_count);
  const hasUrgency = ['30 dias', '60 dias'].some((term) => normalize(answers.urgency).includes(term));
  const predictability = answers.predictability_level || answers.forecast_clarity;
  const mainLeak = answers.main_sales_leak || answers.main_loss_area;
  const followupLoss = answers.followup_loss || answers.lead_followup_loss;
  const incentiveModel = answers.incentive_model || `${answers.commission_calculation || ''} ${answers.seller_commission_visibility || ''}`;
  const hasPain = [
    predictability,
    incentiveModel,
    followupLoss,
    mainLeak,
  ].some((value) => /mais ou menos|perto|nao|manual|planilha|follow-up|gestao|conversao|ritmo|frequencia|as vezes/i.test(normalize(value)));

  if (fitScore >= 70 && sellers >= 5 && hasUrgency && hasPain) return 'reunião imediata';
  if (fitScore >= 40) return 'nutrição';
  return 'sem fit';
}

export function detectContradictions(answers = {}) {
  const contradictions = [];
  const forecast = normalize(answers.predictability_level || answers.forecast_clarity);
  const mainLeak = normalize(answers.main_sales_leak || answers.main_loss_area);
  const followupLoss = normalize(answers.followup_loss || answers.lead_followup_loss);
  const incentive = normalize(answers.incentive_model || `${answers.has_commission || ''} ${answers.seller_commission_visibility || ''}`);

  if (mainLeak.includes('falta de lead') && (followupLoss.includes('frequencia') || followupLoss.includes('as vezes') || followupLoss.includes('nao sei medir'))) {
    contradictions.push('Apesar da percepcao de falta de leads, tambem existe risco de vazamento no aproveitamento das oportunidades que ja chegam.');
  }

  if (forecast.includes('sim, com clareza') && (mainLeak.includes('nao sei') || mainLeak.includes('falta de gestao'))) {
    contradictions.push('A operacao diz ter previsibilidade, mas ainda nao parece enxergar com clareza onde as vendas escapam.');
  }

  if ((incentive.includes('comissao clara') || incentive.includes('premiacao')) && (mainLeak.includes('vendedor sem ritmo') || mainLeak.includes('falta de gestao'))) {
    contradictions.push('Existe algum incentivo, mas ele pode nao estar sustentando ritmo comercial durante o mes.');
  }

  return contradictions;
}

export function buildLeaks(answers = {}, pillars = calculatePillarScores(answers)) {
  const mainLeak = normalize(answers.main_sales_leak || answers.main_loss_area);
  const incentive = normalize(answers.incentive_model || answers.has_commission);
  const hasUnstructuredIncentive = incentive.includes('salario fixo') || incentive.includes('modelo claro') || incentive.includes('nao temos');
  const candidates = [
    {
      title: 'Baixa previsibilidade antes do fechamento',
      score: pillars.previsibilidade_meta,
      explanation: 'A operação não enxerga com clareza se vai bater meta antes do fechamento.',
      impact: 'O gestor perde tempo de correção e atua quando parte do mês já foi consumida.',
    },
    {
      title: hasUnstructuredIncentive ? 'Modelo de incentivo comercial pouco estruturado' : 'Incentivo pouco conectado ao comportamento',
      score: pillars.comissao_incentivo,
      explanation: hasUnstructuredIncentive
        ? 'A operação não utiliza comissão ou incentivo claro para orientar comportamento comercial durante o mês.'
        : 'O incentivo existe, mas pode não orientar ritmo, prioridade e execução durante o mês.',
      impact: hasUnstructuredIncentive
        ? 'O time pode depender mais de cobrança manual do que de estímulos conectados à meta e performance.'
        : 'O incentivo vira reconhecimento, não instrumento diário de performance.',
    },
    {
      title: 'Falta de clareza sobre onde o time perde vendas',
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
      title: 'Vendedor sem ritmo ou rotina clara',
      score: pillars.correcao_individual,
      explanation: 'A rotina comercial não parece criar cadência suficiente para corrigir desvios rapidamente.',
      impact: 'Problemas individuais se repetem até virarem resultado ruim no fechamento.',
    },
  ];

  if (mainLeak.includes('falta de lead')) {
    candidates.push({
      title: 'Oportunidades geradas, mas mal aproveitadas',
      score: pillars.aproveitamento_oportunidades + 5,
      explanation: 'Mesmo com percepção de falta de leads, vale medir se os leads atuais chegam até o fechamento com acompanhamento consistente.',
      impact: 'A empresa pode buscar mais demanda sem corrigir perdas que já acontecem dentro do funil.',
    });
  }

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
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

  if (leakTitles.includes('previsibilidade') || leakTitles.includes('fechamento')) plan.push('Definir indicadores semanais por vendedor e acompanhar risco de meta antes do fechamento.');
  if (leakTitles.includes('incentivo')) plan.push('Estruturar um modelo simples de incentivo conectado a meta, ritmo e comportamento comercial.');
  if (leakTitles.includes('clareza') || leakTitles.includes('ritmo')) plan.push('Criar uma rotina curta de correção individual com dados, causa provável e próxima ação.');
  if (leakTitles.includes('leads') || leakTitles.includes('oportunidades') || leakTitles.includes('acompanhamento')) plan.push('Mapear os pontos de perda depois que o lead chega e travar uma rotina mínima de follow-up.');

  while (plan.length < 3) {
    const additions = [
      'Separar o funil por etapa e identificar onde a conversão cai com mais frequência.',
      'Definir uma reunião semanal de performance com foco em decisão, não apenas cobrança.',
      'Padronizar o acompanhamento de meta, oportunidades e atividade em um único painel.',
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
    score_vendas_previsiveis: score,
    nivel_operacao: level,
    resumo_executivo: `Seu Mapa de Vazamento de Vendas indica uma operação em nível "${level}". Os principais riscos estão ligados a vendas escapando por previsibilidade, follow-up, incentivo ou rotina comercial.`,
    scores_pilares: pillarScores,
    vazamentos: leaks,
    contradicoes: contradictions,
    recomendacao_imediata: actionPlan[0] || 'Mapear os vazamentos mais prováveis e priorizar uma correção comercial simples para os próximos 30 dias.',
    plano_acao: actionPlan,
    fit_vamo_score: fitScore,
    recomendacao_comercial: nextStep,
    mensagem_cta: 'A VAMO pode mostrar, em uma conversa estratégica, quais primeiras correções ajudam a reduzir vazamentos sem prometer resultado sem base.',
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

  normalized.score_previsibilidade = clamp(normalized.score_previsibilidade ?? normalized.score_vendas_previsiveis);
  normalized.score_vendas_previsiveis = normalized.score_previsibilidade;
  normalized.fit_vamo_score = clamp(normalized.fit_vamo_score);
  normalized.nivel_operacao = normalized.nivel_operacao || getMaturityLevel(normalized.score_previsibilidade);
  normalized.vazamentos = Array.isArray(normalized.vazamentos) && normalized.vazamentos.length ? normalized.vazamentos.slice(0, 3) : fallback.vazamentos;
  normalized.contradicoes = Array.isArray(normalized.contradicoes) ? normalized.contradicoes : fallback.contradicoes;
  normalized.recomendacao_imediata = normalized.recomendacao_imediata || fallback.recomendacao_imediata;
  normalized.plano_acao = Array.isArray(normalized.plano_acao) && normalized.plano_acao.length ? normalized.plano_acao.slice(0, 3) : fallback.plano_acao;
  normalized.recomendacao_comercial = ['reunião imediata', 'nutrição', 'sem fit', 'reuniao imediata', 'nutricao'].includes(normalized.recomendacao_comercial)
    ? normalized.recomendacao_comercial.replace('reuniao', 'reunião').replace('nutricao', 'nutrição')
    : classifyCommercialRecommendation(diagnostic.raw_answers || {}, normalized.fit_vamo_score);

  return normalized;
}
