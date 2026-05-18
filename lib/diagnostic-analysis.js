const LEVELS = [
  { max: 25, label: 'Operação no escuro' },
  { max: 50, label: 'Operação reativa' },
  { max: 70, label: 'Operação parcialmente previsível' },
  { max: 85, label: 'Operação gerenciável' },
  { max: 100, label: 'Operação pronta para escalar' },
];

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function answer(answers = {}, key, fallbackKey) {
  return answers[key] ?? (fallbackKey ? answers[fallbackKey] : undefined);
}

function optionScore(value, rules, fallback = 50) {
  if (!value) return fallback;
  const normalized = normalize(value);
  const found = rules.find(([needle]) => normalized.includes(normalize(needle)));
  return found ? found[1] : fallback;
}

function priorityFromScore(score) {
  if (score <= 40) return 'alta';
  if (score <= 65) return 'media';
  return 'baixa';
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
  return LEVELS.find((level) => clamp(score) <= level.max)?.label || LEVELS[LEVELS.length - 1].label;
}

export function calculatePillarScores(answers = {}) {
  const predictability = answer(answers, 'predictability_level', 'forecast_clarity');
  const mainLeak = answer(answers, 'main_sales_leak', 'main_loss_area');
  const leadSource = answer(answers, 'lead_source');
  const followup = answer(answers, 'followup_consistency', 'followup_loss');
  const crmVisibility = answer(answers, 'crm_visibility');
  const processAdoption = answer(answers, 'process_adoption');
  const urgency = answer(answers, 'implementation_urgency', 'urgency');

  const previsibilidadeComercial = optionScore(predictability, [
    ['Sim, com clareza', 92],
    ['Mais ou menos', 62],
    ['Só perto do fechamento', 34],
    ['So perto do fechamento', 34],
    ['Não tenho essa visão', 20],
    ['Nao tenho essa visao', 20],
  ]);

  let aproveitamentoOportunidades = Math.round((
    optionScore(mainLeak, [
      ['Falta de lead qualificado', 54],
      ['Falta de lead', 54],
      ['Demora no primeiro atendimento', 28],
      ['Falta de follow-up', 24],
      ['Baixa conversão em reunião/proposta', 36],
      ['Baixa conversao em reuniao/proposta', 36],
      ['CRM desatualizado', 38],
      ['Gestor sem visibilidade', 32],
      ['Não sei identificar', 26],
      ['Nao sei identificar', 26],
    ]) +
    optionScore(leadSource, [
      ['Tráfego pago', 50],
      ['Trafego pago', 50],
      ['Indicação', 58],
      ['Indicacao', 58],
      ['Prospecção ativa', 56],
      ['Prospeccao ativa', 56],
      ['Orgânico', 64],
      ['Organico', 64],
      ['Base antiga', 60],
      ['Equipe externa', 58],
      ['Misto', 60],
      ['Não sei medir', 42],
      ['Nao sei medir', 42],
    ])
  ) / 2);

  const combined = normalize(JSON.stringify(answers));
  if (/trafego pago/.test(combined) && /demora|follow-up|nao temos padrao|esquecemos/.test(combined)) aproveitamentoOportunidades -= 10;
  if (/indicacao/.test(combined) && /depende do vendedor|nao temos padrao|crm desatualizado/.test(combined)) aproveitamentoOportunidades -= 6;

  const velocidadeFollowup = optionScore(followup, [
    ['Sim, temos cadência clara', 88],
    ['Sim, temos cadencia clara', 88],
    ['Acontece, mas depende do vendedor', 55],
    ['Às vezes esquecemos', 32],
    ['As vezes esquecemos', 32],
    ['Não temos padrão', 22],
    ['Nao temos padrao', 22],
    ['Não sei medir', 28],
    ['Nao sei medir', 28],
    ['Não acontece', 88],
    ['Nao acontece', 88],
    ['Raramente', 72],
    ['Às vezes', 46],
    ['As vezes', 46],
    ['frequência', 18],
    ['frequencia', 18],
  ]);

  const gestaoFunilCrm = optionScore(crmVisibility, [
    ['Sim, pelo CRM/dashboard', 90],
    ['Parcialmente', 62],
    ['Depende de cobrança manual', 42],
    ['Depende de cobranca manual', 42],
    ['Não, fica em WhatsApp/planilha', 24],
    ['Nao, fica em WhatsApp/planilha', 24],
    ['Não usamos CRM', 26],
    ['Nao usamos CRM', 26],
  ], optionScore(mainLeak, [
    ['Gestor sem visibilidade', 34],
    ['CRM desatualizado', 36],
  ], 58));

  const processoAdocao = optionScore(processAdoption, [
    ['Sim, usa bem', 88],
    ['Usa no começo e depois cai', 42],
    ['Usa no comeco e depois cai', 42],
    ['Usa parcialmente', 52],
    ['Quase não usa', 25],
    ['Quase nao usa', 25],
    ['Ainda não tentamos implantar', 55],
    ['Ainda nao tentamos implantar', 55],
  ]);

  const clarezaPrioridade = optionScore(urgency, [
    ['Alta: próximos 30 dias', 82],
    ['Alta: proximos 30 dias', 82],
    ['Média: próximos 60 dias', 72],
    ['Media: proximos 60 dias', 72],
    ['Planejada: próximos 90 dias', 62],
    ['Planejada: proximos 90 dias', 62],
    ['Sem previsão', 38],
    ['Sem previsao', 38],
    ['Só estou pesquisando', 28],
    ['So estou pesquisando', 28],
    ['Agora / próximos 30 dias', 82],
    ['Próximos 60 dias', 72],
    ['Próximos 90 dias', 62],
  ]);

  return {
    previsibilidade_comercial: clamp(previsibilidadeComercial),
    aproveitamento_oportunidades: clamp(aproveitamentoOportunidades),
    velocidade_followup: clamp(velocidadeFollowup),
    gestao_funil_crm: clamp(gestaoFunilCrm),
    processo_adocao: clamp(processoAdocao),
    clareza_prioridade: clamp(clarezaPrioridade),
  };
}

export function calculatePredictabilityScore(answers = {}) {
  const pillars = calculatePillarScores(answers);
  const score =
    pillars.previsibilidade_comercial * 0.22 +
    pillars.aproveitamento_oportunidades * 0.20 +
    pillars.velocidade_followup * 0.18 +
    pillars.gestao_funil_crm * 0.18 +
    pillars.processo_adocao * 0.14 +
    pillars.clareza_prioridade * 0.08;

  return clamp(score);
}

export function calculateFitScore(answers = {}) {
  let score = 0;
  const sellers = getSellerCountValue(answers.seller_count);
  const combined = normalize(JSON.stringify(answers));

  if (sellers >= 6) score += 20;
  else if (sellers >= 3) score += 14;
  else if (sellers >= 1) score += 6;

  if (/whatsapp|ligacao|crm|misto/.test(combined)) score += 10;
  if (/trafego pago|prospeccao ativa|indicacao/.test(combined)) score += 10;
  if (/mais ou menos|perto do fechamento|nao tenho essa visao/.test(combined)) score += 12;
  if (/follow-up|demora|baixa conversao|crm desatualizado|gestor sem visibilidade|nao sei identificar/.test(combined)) score += 16;
  if (/depende do vendedor|esquecemos|nao temos padrao|nao sei medir/.test(combined)) score += 12;
  if (/whatsapp\/planilha|nao usamos crm|cobranca manual/.test(combined)) score += 12;
  if (/depois cai|usa parcialmente|quase nao usa/.test(combined)) score += 10;
  if (/30 dias|60 dias/.test(combined)) score += 12;

  if (/so estou pesquisando/.test(combined)) score -= 16;
  if (/sem previsao/.test(combined)) score -= 8;
  if (sellers <= 2) score -= 8;

  return clamp(score);
}

export function classifyCommercialRecommendation(answers = {}, fitScore = 0) {
  const combined = normalize(JSON.stringify(answers));
  const hasUrgency = /30 dias|60 dias/.test(combined);
  const hasPain = /mais ou menos|perto do fechamento|nao tenho essa visao|follow-up|demora|baixa conversao|crm desatualizado|gestor sem visibilidade|nao sei identificar|depende do vendedor|esquecemos|nao temos padrao|whatsapp\/planilha|nao usamos crm|cobranca manual|depois cai|usa parcialmente|quase nao usa/.test(combined);

  if (fitScore >= 70 && hasUrgency && hasPain) return 'reunião imediata';
  if (fitScore >= 45) return 'nutrição';
  return 'sem fit';
}

export function recommendVamoStructure(answers = {}, leaks = []) {
  const text = normalize(`${JSON.stringify(answers)} ${JSON.stringify(leaks)}`);
  const mainLeak = normalize(answer(answers, 'main_sales_leak', 'main_loss_area'));

  if (/follow-up|acompanhamento/.test(mainLeak)) {
    return {
      nome: 'Máquina de Follow-up',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de perda por falta de cadência, contexto ou continuidade no acompanhamento comercial.',
      proximo_passo: 'Mapear etapas do funil, definir cadência mínima e estruturar alertas ou automações de retomada com contexto.',
    };
  }

  if (/gestor sem visibilidade|crm desatualizado/.test(mainLeak)) {
    return {
      nome: 'CRM Vivo',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de baixa visibilidade do funil e oportunidades paradas sem alerta claro para o gestor.',
      proximo_passo: 'Mapear etapas reais do funil, definir campos mínimos e criar visão de oportunidades paradas.',
    };
  }

  if (/demora no primeiro atendimento|lead qualificado/.test(mainLeak)) {
    return {
      nome: 'Agente Qualificador',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de perda no primeiro contato, triagem ou qualificação das oportunidades.',
      proximo_passo: 'Definir critérios de qualificação, tempo ideal de resposta e repasse ao vendedor com contexto.',
    };
  }

  if (/baixa conversao|proposta/.test(mainLeak)) {
    return {
      nome: 'Proposta Inteligente',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de perda entre proposta, retorno e fechamento.',
      proximo_passo: 'Mapear gargalos de proposta, tempo de envio, personalização e retomada após abertura.',
    };
  }

  if (/follow-up|acompanhamento|esquecemos|nao temos padrao|depende do vendedor/.test(text)) {
    return {
      nome: 'Máquina de Follow-up',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de perda por falta de cadência, contexto ou continuidade no acompanhamento comercial.',
      proximo_passo: 'Mapear etapas do funil, definir cadência mínima e estruturar alertas ou automações de retomada com contexto.',
    };
  }

  if (/demora no primeiro atendimento|whatsapp|lead qualificado|qualificacao/.test(text)) {
    return {
      nome: 'Agente Qualificador',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de perda no primeiro contato, triagem ou qualificação das oportunidades.',
      proximo_passo: 'Definir critérios de qualificação, tempo ideal de resposta e repasse ao vendedor com contexto.',
    };
  }

  if (/crm|dashboard|planilha|gestor sem visibilidade|oportunidades estao paradas|cobranca manual/.test(text)) {
    return {
      nome: 'CRM Vivo',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de baixa visibilidade do funil e oportunidades paradas sem alerta claro para o gestor.',
      proximo_passo: 'Mapear etapas reais do funil, definir campos mínimos e criar visão de oportunidades paradas.',
    };
  }

  if (/previsibilidade|meta|fechamento|resultado do mes/.test(text)) {
    return {
      nome: 'Copiloto do Gestor',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de gestão reativa e baixa clareza sobre o resultado antes do fechamento.',
      proximo_passo: 'Definir indicadores semanais, alertas de risco e painel de priorização para o gestor.',
    };
  }

  if (/proposta|baixa conversao em reuniao\/proposta|fechamento/.test(text)) {
    return {
      nome: 'Proposta Inteligente',
      tipo: 'estrutura_prioritaria',
      motivo: 'Há sinais de perda entre proposta, retorno e fechamento.',
      proximo_passo: 'Mapear gargalos de proposta, tempo de envio, personalização e retomada após abertura.',
    };
  }

  return {
    nome: 'Diagnóstico + Priorização VAMO',
    tipo: 'entrada_consultiva',
    motivo: 'Os sinais indicam mais de um vazamento possível. Antes de implantar tecnologia, é melhor priorizar a primeira correção com base em impacto e esforço.',
    proximo_passo: 'Realizar leitura estratégica para mapear o funil real, definir KPI e priorizar a primeira estrutura de implantação.',
  };
}

export function detectContradictions(answers = {}) {
  const contradictions = [];
  const forecast = normalize(answer(answers, 'predictability_level', 'forecast_clarity'));
  const mainLeak = normalize(answer(answers, 'main_sales_leak', 'main_loss_area'));
  const followup = normalize(answer(answers, 'followup_consistency', 'followup_loss'));
  const crm = normalize(answer(answers, 'crm_visibility'));
  const process = normalize(answer(answers, 'process_adoption'));
  const leadSource = normalize(answer(answers, 'lead_source'));

  if (mainLeak.includes('falta de lead') && (/depende do vendedor|esquecemos|nao temos padrao|nao sei medir/.test(followup) || /manual|whatsapp|planilha|nao usamos crm/.test(crm))) {
    contradictions.push('Apesar da percepção de falta de leads, também existem sinais de vazamento no aproveitamento das oportunidades que já chegam.');
  }

  if (forecast.includes('sim, com clareza') && (mainLeak.includes('nao sei') || mainLeak.includes('gestor sem visibilidade') || mainLeak.includes('crm desatualizado'))) {
    contradictions.push('A operação diz ter previsibilidade, mas ainda não parece enxergar com clareza onde as vendas escapam.');
  }

  if (crm.includes('crm') && crm.includes('cobranca manual')) {
    contradictions.push('Existe alguma estrutura de registro, mas a gestão ainda parece depender de cobrança manual para identificar oportunidades paradas.');
  }

  if (/depois cai|usa parcialmente|quase nao usa/.test(process)) {
    contradictions.push('A empresa já tentou estruturar processo ou ferramenta, mas há sinais de baixa adoção pelo time comercial.');
  }

  if (leadSource.includes('trafego pago') && /depende do vendedor|esquecemos|nao temos padrao|nao sei medir/.test(followup)) {
    contradictions.push('A empresa investe para gerar oportunidades, mas pode estar perdendo parte do retorno dentro da própria operação comercial.');
  }

  return contradictions;
}

export function buildLeaks(answers = {}, pillars = calculatePillarScores(answers)) {
  const mainLeak = normalize(answer(answers, 'main_sales_leak', 'main_loss_area'));
  const followup = normalize(answer(answers, 'followup_consistency', 'followup_loss'));
  const crm = normalize(answer(answers, 'crm_visibility'));
  const process = normalize(answer(answers, 'process_adoption'));
  const leadSource = normalize(answer(answers, 'lead_source'));

  const candidates = [
    {
      titulo: 'Baixa previsibilidade antes do fechamento',
      score: pillars.previsibilidade_comercial - (mainLeak.includes('gestor sem visibilidade') ? 8 : 0),
      explicacao: 'A operação não enxerga com clareza se vai bater meta antes do fechamento.',
      impacto: 'O gestor perde tempo de correção e atua quando parte das oportunidades já esfriou.',
    },
    {
      titulo: 'Oportunidades geradas, mas mal aproveitadas',
      score: pillars.aproveitamento_oportunidades - (mainLeak.includes('falta de lead') ? 8 : 0),
      explicacao: 'Mesmo quando a demanda existe, parte das oportunidades pode se perder entre entrada, qualificação, proposta e fechamento.',
      impacto: 'A empresa busca mais leads antes de corrigir perdas dentro do próprio funil.',
    },
    {
      titulo: 'Follow-up sem cadência clara',
      score: pillars.velocidade_followup - (/follow-up|depende do vendedor|esquecemos|nao temos padrao/.test(`${mainLeak} ${followup}`) ? 10 : 0),
      explicacao: 'A operação depende da memória ou disciplina individual do vendedor para retomar oportunidades.',
      impacto: 'Leads quentes podem esfriar sem que o gestor perceba a tempo.',
    },
    {
      titulo: 'CRM sem visibilidade real',
      score: pillars.gestao_funil_crm - (/crm|gestor sem visibilidade|manual|whatsapp|planilha|nao usamos/.test(`${mainLeak} ${crm}`) ? 10 : 0),
      explicacao: 'As oportunidades até podem existir, mas não aparecem com clareza para tomada de decisão diária.',
      impacto: 'O gestor passa a corrigir o comercial por cobrança manual, não por dados do funil.',
    },
    {
      titulo: 'Demora no primeiro atendimento',
      score: pillars.aproveitamento_oportunidades - (mainLeak.includes('demora') ? 18 : 0),
      explicacao: 'A velocidade entre entrada do lead e primeiro contato útil pode estar abaixo do necessário.',
      impacto: 'Oportunidades com intenção de compra perdem temperatura antes da conversa comercial avançar.',
    },
    {
      titulo: 'Processo sem adoção pelo time',
      score: pillars.processo_adocao - (/depois cai|usa parcialmente|quase nao usa/.test(process) ? 22 : 0),
      explicacao: 'A empresa pode até tentar usar ferramentas, mas o time não sustenta o uso no dia a dia.',
      impacto: 'A tecnologia vira mais uma tela e impede que a IA gere impacto real na rotina.',
    },
    {
      titulo: 'Gestão por feeling e correção tardia',
      score: Math.round((pillars.previsibilidade_comercial + pillars.gestao_funil_crm) / 2),
      explicacao: 'A leitura da operação depende mais de percepção e cobrança do que de indicadores acionáveis.',
      impacto: 'A correção chega depois que parte do mês já foi consumida.',
    },
    {
      titulo: 'Lead quente esfriando por falta de contexto',
      score: pillars.velocidade_followup - (/whatsapp|trafego pago|indicacao/.test(`${leadSource} ${crm}`) ? 6 : 0),
      explicacao: 'O lead demonstra interesse, mas o contexto da conversa não vira próxima ação clara.',
      impacto: 'A operação perde continuidade e precisa recomeçar conversas que já deveriam estar avançando.',
    },
    {
      titulo: 'Baixa conversão entre reunião, proposta e fechamento',
      score: pillars.aproveitamento_oportunidades - (mainLeak.includes('baixa conversao') ? 14 : 0),
      explicacao: 'O gargalo pode estar no avanço entre conversa, proposta, retorno e decisão.',
      impacto: 'O time cria atividade comercial, mas não transforma essa atividade em fechamento previsível.',
    },
    {
      titulo: 'Falta de clareza sobre o principal gargalo comercial',
      score: pillars.clareza_prioridade - (mainLeak.includes('nao sei') ? 18 : 0),
      explicacao: 'A operação ainda não diferencia claramente falta de demanda, perda de atendimento, CRM parado ou baixa adoção.',
      impacto: 'Sem priorização, a empresa tende a comprar ferramentas antes de definir o KPI que precisa corrigir.',
    },
  ];

  return candidates
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((item) => ({
      titulo: item.titulo,
      explicacao: item.explicacao,
      impacto: item.impacto,
      prioridade: priorityFromScore(item.score),
    }));
}

export function buildActionPlan(answers = {}, leaks = []) {
  const plan = [];
  const leakTitles = normalize(leaks.map((leak) => leak.titulo).join(' | '));

  if (leakTitles.includes('follow-up') || leakTitles.includes('lead quente')) {
    plan.push('Mapear em quais etapas os leads param sem retorno.');
    plan.push('Definir uma cadência mínima de retomada por tipo de oportunidade.');
    plan.push('Criar alertas ou automações para impedir que leads quentes fiquem sem acompanhamento.');
  } else if (leakTitles.includes('crm') || leakTitles.includes('visibilidade') || leakTitles.includes('gestao')) {
    plan.push('Mapear as etapas reais do funil comercial.');
    plan.push('Definir os campos mínimos que precisam estar atualizados para o gestor agir.');
    plan.push('Criar uma visão de oportunidades paradas, risco de meta e próximos passos.');
  } else if (leakTitles.includes('atendimento') || leakTitles.includes('qualificado') || leakTitles.includes('oportunidades')) {
    plan.push('Definir critérios claros de qualificação comercial.');
    plan.push('Reduzir o tempo entre entrada do lead e primeiro contato útil.');
    plan.push('Padronizar o repasse ao vendedor com contexto, score e próxima ação.');
  } else if (leakTitles.includes('adocao') || leakTitles.includes('processo')) {
    plan.push('Identificar por que o time não sustenta o uso das ferramentas atuais.');
    plan.push('Reduzir o processo ao mínimo necessário para gerar visibilidade real.');
    plan.push('Implantar a rotina com treinamento, acompanhamento e ajustes de adoção.');
  }

  while (plan.length < 3) {
    const additions = [
      'Separar o funil por etapa e identificar onde a conversão cai com mais frequência.',
      'Definir um KPI de correção antes de implantar qualquer ferramenta.',
      'Criar uma rotina semanal de decisão comercial com dados, próximos passos e responsáveis.',
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
  const recommendedStructure = recommendVamoStructure(answers, leaks);
  const actionPlan = buildActionPlan(answers, leaks);
  const nextStep = classifyCommercialRecommendation(answers, fitScore);
  const level = getMaturityLevel(score);

  return {
    score_previsibilidade: score,
    score_vendas_previsiveis: score,
    nivel_operacao: level,
    resumo_executivo: `Seu Mapa de Vazamento de Vendas indica uma operação em nível "${level}". Os principais riscos estão ligados a perdas por previsibilidade, follow-up, gestão do funil, aproveitamento de oportunidades ou baixa adoção de processo.`,
    scores_pilares: pillarScores,
    vazamentos: leaks,
    contradicoes: contradictions,
    estrutura_recomendada: recommendedStructure,
    recomendacao_imediata: actionPlan[0] || 'Mapear os vazamentos mais prováveis e priorizar uma primeira correção comercial antes de implantar qualquer ferramenta.',
    plano_acao: actionPlan,
    fit_vamo_score: fitScore,
    recomendacao_comercial: nextStep,
    mensagem_cta: 'A VAMO pode fazer uma leitura estratégica do seu mapa, validar onde o vazamento realmente acontece e indicar qual estrutura comercial deve ser implantada primeiro.',
  };
}

export function normalizeReport(report, diagnostic = {}) {
  const fallback = buildFallbackReport(diagnostic);
  const normalized = {
    ...fallback,
    ...(report || {}),
    scores_pilares: {
      ...fallback.scores_pilares,
      ...(report?.scores_pilares || {}),
    },
  };

  const oldPillars = report?.scores_pilares || {};
  normalized.scores_pilares = {
    previsibilidade_comercial: clamp(normalized.scores_pilares.previsibilidade_comercial ?? oldPillars.previsibilidade_meta ?? fallback.scores_pilares.previsibilidade_comercial),
    aproveitamento_oportunidades: clamp(normalized.scores_pilares.aproveitamento_oportunidades ?? fallback.scores_pilares.aproveitamento_oportunidades),
    velocidade_followup: clamp(normalized.scores_pilares.velocidade_followup ?? oldPillars.rotina_acompanhamento ?? fallback.scores_pilares.velocidade_followup),
    gestao_funil_crm: clamp(normalized.scores_pilares.gestao_funil_crm ?? oldPillars.gestao_performance ?? fallback.scores_pilares.gestao_funil_crm),
    processo_adocao: clamp(normalized.scores_pilares.processo_adocao ?? fallback.scores_pilares.processo_adocao),
    clareza_prioridade: clamp(normalized.scores_pilares.clareza_prioridade ?? oldPillars.correcao_individual ?? fallback.scores_pilares.clareza_prioridade),
  };

  normalized.score_previsibilidade = clamp(report?.score_previsibilidade ?? report?.score_vendas_previsiveis ?? fallback.score_previsibilidade);
  normalized.score_vendas_previsiveis = normalized.score_previsibilidade;
  normalized.fit_vamo_score = clamp(normalized.fit_vamo_score);
  normalized.nivel_operacao = normalized.nivel_operacao || getMaturityLevel(normalized.score_previsibilidade);
  normalized.vazamentos = Array.isArray(normalized.vazamentos) && normalized.vazamentos.length ? normalized.vazamentos.slice(0, 3) : fallback.vazamentos;
  normalized.contradicoes = Array.isArray(normalized.contradicoes) ? normalized.contradicoes : fallback.contradicoes;
  normalized.estrutura_recomendada = normalized.estrutura_recomendada || fallback.estrutura_recomendada;
  normalized.recomendacao_imediata = normalized.recomendacao_imediata || fallback.recomendacao_imediata;
  normalized.plano_acao = Array.isArray(normalized.plano_acao) && normalized.plano_acao.length ? normalized.plano_acao.slice(0, 3) : fallback.plano_acao;
  normalized.recomendacao_comercial = ['reunião imediata', 'nutrição', 'sem fit', 'reuniao imediata', 'nutricao'].includes(normalize(normalized.recomendacao_comercial))
    ? normalize(normalized.recomendacao_comercial).replace('reuniao', 'reunião').replace('nutricao', 'nutrição')
    : classifyCommercialRecommendation(diagnostic.raw_answers || {}, normalized.fit_vamo_score);
  normalized.mensagem_cta = normalized.mensagem_cta || fallback.mensagem_cta;

  return normalized;
}
