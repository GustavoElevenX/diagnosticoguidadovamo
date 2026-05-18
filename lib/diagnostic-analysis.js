const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));
const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function answer(answers = {}, key, ...fallbackKeys) {
  if (answers[key] != null) return answers[key];
  const fallbackKey = fallbackKeys.find((candidate) => answers[candidate] != null);
  return fallbackKey ? answers[fallbackKey] : undefined;
}

function optionScore(value, rules, fallback = 50) {
  if (!value) return fallback;
  const normalized = normalize(value);
  const found = rules.find(([needle]) => normalized.includes(normalize(needle)));
  return found ? found[1] : fallback;
}

function priorityWeight(priority) {
  return { alta: 3, media: 2, baixa: 1 }[normalize(priority)] || 0;
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

export function getOperationLevel(score) {
  const value = clamp(score);
  if (value >= 82) return 'Operação com boa previsibilidade';
  if (value >= 66) return 'Operação com pontos claros de correção';
  if (value >= 48) return 'Operação comercial dependente de pessoas';
  if (value >= 32) return 'Operação com vazamentos relevantes';
  return 'Operação sem estrutura comercial suficiente';
}

export const getMaturityLevel = getOperationLevel;

export function calculatePillarScores(answers = {}) {
  const processClarity = answer(answers, 'commercial_process_clarity', 'process_clarity');
  const opportunityHandling = answer(answers, 'opportunity_handling', 'opportunity_flow');
  const nextStep = answer(answers, 'next_step_discipline', 'followup_consistency', 'followup_loss');
  const visibility = answer(answers, 'management_visibility', 'crm_visibility', 'predictability_level', 'forecast_clarity');
  const routine = answer(answers, 'commercial_routine');
  const adoption = answer(answers, 'process_technology_adoption', 'process_adoption');
  const priority = answer(answers, 'implementation_priority', 'implementation_urgency', 'urgency');

  let clarezaProcessoComercial = optionScore(processClarity, [
    ['Sim, temos etapas claras e o time segue', 90],
    ['Temos etapas, mas cada pessoa executa de um jeito', 68],
    ['cada pessoa executa', 68],
    ['Existe uma noção geral, mas não está padronizado', 48],
    ['padronizado', 48],
    ['Fica muito na cabeça do dono ou gestor', 34],
    ['cabeça do dono', 34],
    ['cabeca do dono', 34],
    ['Não temos um processo comercial claro', 22],
    ['processo comercial claro', 22],
    ['Sim, com clareza', 82],
    ['Mais ou menos', 58],
    ['Só perto do fechamento', 38],
    ['Não tenho essa visão', 28],
  ], 50);

  const aproveitamentoOportunidades = optionScore(opportunityHandling, [
    ['Ela entra em uma rotina clara de atendimento e acompanhamento', 88],
    ['Alguém atende, mas o padrão depende da pessoa', 65],
    ['depende da pessoa', 65],
    ['Às vezes demora para alguém assumir', 42],
    ['demora para', 42],
    ['O atendimento acontece, mas o contexto se perde depois', 38],
    ['contexto se perde', 38],
    ['Não temos controle claro do que acontece com cada oportunidade', 24],
    ['controle claro', 24],
    ['Demora no primeiro atendimento', 34],
    ['Falta de lead qualificado', 54],
    ['Baixa conversão em reunião/proposta', 42],
  ], 50);

  let continuidadeComercial = optionScore(nextStep, [
    ['Sim, toda oportunidade tem próximo passo definido', 90],
    ['passo definido', 90],
    ['Na maioria das vezes, mas ainda depende do vendedor', 68],
    ['depende do vendedor', 68],
    ['Só acompanhamos melhor as oportunidades mais quentes', 44],
    ['mais quentes', 44],
    ['Muitas oportunidades ficam sem retomada clara', 30],
    ['sem retomada clara', 30],
    ['Não conseguimos medir isso hoje', 26],
    ['medir isso', 26],
    ['Sim, temos cadência clara', 88],
    ['Acontece, mas depende do vendedor', 55],
    ['Às vezes esquecemos', 32],
    ['Não temos padrão', 22],
    ['Não sei medir', 28],
  ], 50);

  const visibilidadeGestao = optionScore(visibility, [
    ['Sim, temos visão clara e ação durante o mês', 90],
    ['Temos alguns dados, mas a leitura ainda é manual', 65],
    ['leitura ainda', 65],
    ['Só percebemos os problemas perto do fechamento', 42],
    ['perto do fechamento', 42],
    ['Dependemos de perguntar para o time ou olhar conversas', 32],
    ['perguntar para o time', 32],
    ['olhar conversas', 32],
    ['Não temos essa visão hoje', 22],
    ['essa visão hoje', 22],
    ['essa visao hoje', 22],
    ['Sim, pelo CRM/dashboard', 78],
    ['Parcialmente', 60],
    ['Depende de cobrança manual', 38],
    ['Não, fica em WhatsApp/planilha', 28],
    ['Não usamos CRM', 28],
    ['Sim, com clareza', 86],
    ['Mais ou menos', 62],
    ['Só perto do fechamento', 42],
    ['Não tenho essa visão', 22],
  ], 50);

  const rotinaPrevisibilidade = optionScore(routine, [
    ['Sim, com frequência e padrão claro', 90],
    ['Acontece, mas sem muita profundidade', 65],
    ['sem muita profundidade', 65],
    ['Acontece só quando o resultado aperta', 42],
    ['resultado aperta', 42],
    ['Depende do gestor lembrar e cobrar', 35],
    ['lembrar e cobrar', 35],
    ['Não existe rotina comercial estruturada', 22],
    ['rotina comercial estruturada', 22],
  ], 50);

  const adocaoOperacional = optionScore(adoption, [
    ['Sim, o time usa e a gestão acompanha', 88],
    ['Usa no começo, mas perde força depois', 48],
    ['perde força depois', 48],
    ['perde forca depois', 48],
    ['Parte do time usa e parte ignora', 42],
    ['parte ignora', 42],
    ['Já tentamos e não virou rotina', 32],
    ['não virou rotina', 32],
    ['nao virou rotina', 32],
    ['Ainda não tentamos implantar algo estruturado', 50],
    ['algo estruturado', 50],
    ['Sim, usa bem', 88],
    ['Usa no começo e depois cai', 48],
    ['Usa parcialmente', 42],
    ['Quase não usa', 32],
    ['Ainda não tentamos implantar', 50],
  ], 50);

  const prioridadeImplantacao = optionScore(priority, [
    ['Mais velocidade no atendimento e qualificação', 80],
    ['velocidade no atendimento', 80],
    ['Menos oportunidades esquecidas ou sem retomada', 85],
    ['sem retomada', 85],
    ['Mais visibilidade para o gestor agir durante o mês', 85],
    ['visibilidade para o gestor', 85],
    ['Mais padrão comercial entre as pessoas do time', 82],
    ['padrão comercial', 82],
    ['padrao comercial', 82],
    ['Propostas mais rápidas e melhor acompanhamento de fechamento', 78],
    ['propostas mais', 78],
    ['Organizar o processo antes de qualquer tecnologia', 90],
    ['organizar o processo', 90],
    ['Ainda não sei o que priorizar', 68],
    ['priorizar', 68],
    ['Alta: próximos 30 dias', 82],
    ['Média: próximos 60 dias', 72],
    ['Planejada: próximos 90 dias', 62],
    ['Sem previsão', 38],
    ['Só estou pesquisando', 28],
  ], 70);

  const bottleneck = normalize(answer(answers, 'sales_bottleneck', 'main_sales_leak'));
  if (/manter padrao|nao sei identificar/.test(bottleneck)) clarezaProcessoComercial -= 6;
  if (/retomar|proposta|interesse/.test(bottleneck)) continuidadeComercial -= 12;

  return {
    clareza_processo_comercial: clamp(clarezaProcessoComercial),
    aproveitamento_oportunidades: clamp(aproveitamentoOportunidades),
    continuidade_comercial: clamp(continuidadeComercial),
    visibilidade_gestao: clamp(visibilidadeGestao),
    rotina_previsibilidade: clamp(rotinaPrevisibilidade),
    adocao_operacional: clamp(adocaoOperacional),
    prioridade_implantacao: clamp(prioridadeImplantacao),
  };
}

export function calculatePredictabilityScore(answers = {}) {
  const pillars = calculatePillarScores(answers);
  return clamp(
    pillars.clareza_processo_comercial * 0.18 +
    pillars.aproveitamento_oportunidades * 0.16 +
    pillars.continuidade_comercial * 0.16 +
    pillars.visibilidade_gestao * 0.18 +
    pillars.rotina_previsibilidade * 0.14 +
    pillars.adocao_operacional * 0.10 +
    pillars.prioridade_implantacao * 0.08
  );
}

export function calculateFitScore(answers = {}) {
  const sellers = getSellerCountValue(answers.seller_count);
  const pillars = calculatePillarScores(answers);
  const combined = normalize(JSON.stringify(answers));
  let score = 20;

  if (sellers >= 11) score += 18;
  else if (sellers >= 6) score += 16;
  else if (sellers >= 3) score += 12;
  else if (sellers >= 1) score += 6;

  if (/consultiva|proposta|orcamento|sdr|closer|equipe externa|recorrente/.test(combined)) score += 12;
  if (pillars.clareza_processo_comercial < 60) score += 12;
  if (pillars.visibilidade_gestao < 60) score += 12;
  if (pillars.continuidade_comercial < 60) score += 10;
  if (pillars.rotina_previsibilidade < 60) score += 10;
  if (pillars.adocao_operacional <= 50) score += 8;
  if (/organizar o processo|visibilidade|retomada|velocidade|propostas|padrao comercial/.test(combined)) score += 10;
  if (/so estou pesquisando|sem previsao/.test(combined)) score -= 16;
  if (sellers <= 2) score -= 6;

  return clamp(score);
}

export function classifyCommercialRecommendation(answers = {}, fitScore = 0) {
  const pillars = calculatePillarScores(answers);
  const hasRelevantLeak = Object.entries(pillars)
    .filter(([key]) => key !== 'prioridade_implantacao')
    .some(([, value]) => value < 60);

  if (fitScore >= 70 && hasRelevantLeak) return 'reunião imediata';
  if (fitScore >= 45) return 'nutrição estratégica';
  return 'sem fit agora';
}

export function buildLeaks(answers = {}, pillars = calculatePillarScores(answers)) {
  const combined = normalize(Object.values(answers || {}).join(' '));
  const leaks = [];

  const addLeak = (leak) => {
    if (!leaks.some((item) => item.titulo === leak.titulo)) leaks.push(leak);
  };

  if (pillars.clareza_processo_comercial < 60) {
    addLeak({
      titulo: 'Processo comercial sem padrão suficiente',
      explicacao: 'A venda parece depender mais de pessoas, memória ou improviso do que de uma rotina comercial clara.',
      impacto: 'Isso dificulta escala, treinamento, previsibilidade e qualquer implantação de IA ou automação.',
      prioridade: pillars.clareza_processo_comercial < 40 ? 'alta' : 'media',
    });
  }

  if (pillars.aproveitamento_oportunidades < 60) {
    addLeak({
      titulo: combined.includes('qualificar') || combined.includes('qualificacao') ? 'Velocidade e qualificação abaixo do necessário' : 'Oportunidades perdem força logo no início',
      explicacao: 'Quando uma oportunidade não recebe dono, velocidade e contexto, ela pode esfriar antes de virar reunião, proposta ou venda.',
      impacto: 'A empresa pode buscar mais demanda sem perceber que parte das oportunidades atuais já está escapando.',
      prioridade: pillars.aproveitamento_oportunidades < 45 ? 'alta' : 'media',
    });
  }

  if (pillars.continuidade_comercial < 60) {
    addLeak({
      titulo: 'Falta de disciplina de próxima ação',
      explicacao: 'O cliente demonstra interesse, mas a operação não garante retomada, prazo, contexto e acompanhamento até a decisão.',
      impacto: 'Vendas quentes podem morrer sem uma perda explícita, apenas por falta de continuidade.',
      prioridade: pillars.continuidade_comercial < 45 ? 'alta' : 'media',
    });
  }

  if (pillars.visibilidade_gestao < 60) {
    addLeak({
      titulo: 'Gestão sem visibilidade para corrigir a tempo',
      explicacao: 'O gestor não enxerga com clareza onde o funil está travando durante o mês.',
      impacto: 'A correção chega tarde, quando a meta já está comprometida ou a oportunidade já esfriou.',
      prioridade: pillars.visibilidade_gestao < 45 ? 'alta' : 'media',
    });
  }

  if (pillars.rotina_previsibilidade < 60) {
    addLeak({
      titulo: 'Rotina comercial fraca ou reativa',
      explicacao: 'A operação não parece ter uma cadência forte para revisar gargalos, próximos passos e ações comerciais da semana.',
      impacto: 'Sem rotina, dados não viram ação e o comercial depende de cobrança pontual.',
      prioridade: pillars.rotina_previsibilidade < 45 ? 'alta' : 'media',
    });
  }

  if (pillars.adocao_operacional < 55) {
    addLeak({
      titulo: combined.includes('parte do time') ? 'Padrão de execução e adoção parcial' : 'Risco de baixa adoção da estrutura implantada',
      explicacao: 'Processo, sistema ou automação só geram resultado quando entram na rotina real do time.',
      impacto: 'Sem adoção, a empresa cria mais uma tela ou mais uma regra que o time abandona depois.',
      prioridade: pillars.adocao_operacional < 40 ? 'alta' : 'media',
    });
  }

  if (combined.includes('proposta') || combined.includes('orcamento') || combined.includes('fechamento')) {
    addLeak({
      titulo: 'Perda entre proposta e fechamento',
      explicacao: 'A venda pode estar perdendo força depois que o cliente demonstra interesse e antes da decisão final.',
      impacto: 'Propostas sem velocidade, acompanhamento e contexto reduzem a chance de fechamento.',
      prioridade: combined.includes('propostas mais rapidas') ? 'alta' : 'media',
    });
  }

  while (leaks.length < 3) {
    addLeak([
      {
        titulo: 'Falta de priorização sobre onde IA gera retorno real',
        explicacao: 'Há mais de um ponto possível de perda e a operação precisa escolher a primeira frente de correção.',
        impacto: 'Sem priorização, a empresa corre o risco de implantar tecnologia antes de definir o gargalo certo.',
        prioridade: 'media',
      },
      {
        titulo: 'Venda dependente de pessoas específicas',
        explicacao: 'Parte da execução comercial parece depender de memória, experiência individual ou cobrança direta.',
        impacto: 'Isso limita escala e dificulta manter padrão quando o volume ou o time cresce.',
        prioridade: 'media',
      },
      {
        titulo: 'Perda de contexto entre atendimento, proposta e retomada',
        explicacao: 'O contexto da oportunidade precisa acompanhar a venda até a decisão.',
        impacto: 'Quando o contexto se perde, a operação recomeça conversas e reduz velocidade de fechamento.',
        prioridade: 'baixa',
      },
    ][leaks.length]);
  }

  return leaks
    .sort((a, b) => priorityWeight(b.prioridade) - priorityWeight(a.prioridade))
    .slice(0, 3);
}

export function recommendVamoStructure(answers = {}, pillars = calculatePillarScores(answers), leaks = []) {
  const priority = normalize(answer(answers, 'implementation_priority'));
  const bottleneck = normalize(answer(answers, 'sales_bottleneck', 'main_sales_leak'));
  const combined = normalize(`${priority} ${bottleneck} ${leaks.map((leak) => leak.titulo).join(' ')}`);

  if (
    combined.includes('organizar o processo') ||
    pillars.clareza_processo_comercial < 45 ||
    combined.includes('nao sei')
  ) {
    return {
      nome: 'Diagnóstico e Priorização VAMO',
      tipo: 'engenharia de processo comercial',
      motivo: 'Antes de implantar IA, CRM ou automação, a operação precisa definir etapas, critérios, responsabilidades e primeira frente de correção.',
      proximo_passo: 'Mapear o funil atual, identificar gargalos por etapa e priorizar a primeira implantação com maior impacto e menor complexidade.',
    };
  }

  if (priority.includes('velocidade') || priority.includes('qualificacao') || combined.includes('responder rapido')) {
    return {
      nome: 'Agente Qualificador',
      tipo: 'qualificação e velocidade comercial',
      motivo: 'O vazamento aparece no início da jornada, onde a oportunidade precisa ser atendida, qualificada e repassada com contexto.',
      proximo_passo: 'Definir critérios de qualificação, regras de passagem para o time e integração com a rotina comercial existente.',
    };
  }

  if (priority.includes('proposta') || priority.includes('fechamento')) {
    return {
      nome: 'Proposta Inteligente',
      tipo: 'proposta e fechamento',
      motivo: 'A perda aparece na passagem entre interesse, proposta, acompanhamento e decisão.',
      proximo_passo: 'Padronizar geração de proposta, contexto comercial, alertas de abertura e retomada de fechamento.',
    };
  }

  if (priority.includes('visibilidade') || combined.includes('funil trava') || (pillars.visibilidade_gestao < 55 && !priority.includes('retomada') && !priority.includes('esquecidas'))) {
    return {
      nome: 'Copiloto do Gestor',
      tipo: 'gestão e previsibilidade comercial',
      motivo: 'O gestor precisa enxergar onde agir durante o mês, não apenas analisar o resultado depois.',
      proximo_passo: 'Definir indicadores de saúde do funil, alertas de oportunidade parada e rituais de correção semanal.',
    };
  }

  if (combined.includes('retomar') || combined.includes('esquecidas') || combined.includes('proxima acao') || combined.includes('continuidade')) {
    return {
      nome: 'Máquina de Follow-up',
      tipo: 'continuidade e retomada comercial',
      motivo: 'A principal perda parece acontecer depois que o cliente demonstra interesse, mas antes da decisão final.',
      proximo_passo: 'Mapear etapas de retomada, criar cadências por contexto e definir alertas para oportunidades sem próxima ação.',
    };
  }

  if (combined.includes('visibilidade') || combined.includes('gestor') || pillars.visibilidade_gestao < 55) {
    return {
      nome: 'Copiloto do Gestor',
      tipo: 'gestão e previsibilidade comercial',
      motivo: 'O gestor precisa enxergar onde agir durante o mês, não apenas analisar o resultado depois.',
      proximo_passo: 'Definir indicadores de saúde do funil, alertas de oportunidade parada e rituais de correção semanal.',
    };
  }

  if (combined.includes('padrao comercial') || combined.includes('padrao de execucao') || pillars.rotina_previsibilidade < 55) {
    return {
      nome: 'CRM Vivo / Camada de Inteligência do Funil',
      tipo: 'processo, dados e execução comercial',
      motivo: 'A operação precisa transformar conversas e etapas comerciais em dados úteis para gestão e próxima ação.',
      proximo_passo: 'Mapear etapas do funil, criar critérios por estágio e definir como as informações serão atualizadas sem depender de esforço manual excessivo.',
    };
  }

  if (combined.includes('proposta') || combined.includes('fechamento')) {
    return {
      nome: 'Proposta Inteligente',
      tipo: 'proposta e fechamento',
      motivo: 'A perda aparece na passagem entre interesse, proposta, acompanhamento e decisão.',
      proximo_passo: 'Padronizar geração de proposta, contexto comercial, alertas de abertura e retomada de fechamento.',
    };
  }

  if (combined.includes('perfil certo') || combined.includes('atrair oportunidades')) {
    return {
      nome: 'Motor de Prospecção',
      tipo: 'geração e priorização de oportunidades',
      motivo: 'A empresa sente perda na entrada de oportunidades, mas a implantação deve conectar prospecção com processo e acompanhamento.',
      proximo_passo: 'Definir ICP, sinais de compra, critérios de prioridade e rotina de abordagem com contexto.',
    };
  }

  return {
    nome: 'Diagnóstico e Priorização VAMO',
    tipo: 'priorização estratégica de implantação',
    motivo: 'As respostas indicam mais de um possível vazamento. Antes de implantar tecnologia, é melhor priorizar a frente com maior impacto operacional.',
    proximo_passo: 'Validar o mapa com a VAMO e escolher a primeira estrutura a implantar com base em impacto, esforço e adoção.',
  };
}

export function detectContradictions(answers = {}) {
  const contradictions = [];
  const bottleneck = normalize(answer(answers, 'sales_bottleneck', 'main_sales_leak'));
  const process = normalize(answer(answers, 'commercial_process_clarity'));
  const visibility = normalize(answer(answers, 'management_visibility', 'crm_visibility', 'predictability_level'));
  const adoption = normalize(answer(answers, 'process_technology_adoption', 'process_adoption'));

  if (bottleneck.includes('perfil certo') && /depende|demora|contexto se perde|sem retomada|nao conseguimos medir/.test(normalize(JSON.stringify(answers)))) {
    contradictions.push('Apesar da percepção de entrada de oportunidades, também há sinais de perda no aproveitamento e na continuidade das oportunidades atuais.');
  }

  if (/sim, temos etapas claras/.test(process) && /manual|perguntar|nao temos essa visao|perto do fechamento/.test(visibility)) {
    contradictions.push('A operação diz ter processo claro, mas a gestão ainda não parece enxergar os gargalos a tempo de corrigir.');
  }

  if (/perde forca|ignora|nao virou rotina/.test(adoption)) {
    contradictions.push('A empresa já tentou estruturar processo ou tecnologia, mas há sinal de baixa adoção na rotina comercial.');
  }

  return contradictions;
}

export function buildActionPlan(answers = {}, leaks = []) {
  const leakTitles = normalize(leaks.map((leak) => leak.titulo).join(' | '));
  const plan = [];

  if (leakTitles.includes('processo comercial')) {
    plan.push('Mapear as etapas reais da venda, do primeiro contato ao fechamento.');
    plan.push('Definir responsáveis, critérios e próxima ação para cada etapa do funil.');
  }

  if (leakTitles.includes('proxima acao') || leakTitles.includes('continuidade') || leakTitles.includes('retomada')) {
    plan.push('Criar uma cadência de retomada por tipo de oportunidade e nível de intenção.');
  }

  if (leakTitles.includes('visibilidade') || leakTitles.includes('rotina')) {
    plan.push('Criar uma rotina semanal de revisão de oportunidades paradas e gargalos comerciais.');
  }

  if (leakTitles.includes('adocao')) {
    plan.push('Definir como a estrutura implantada será acompanhada até virar uso real do time.');
  }

  if (leakTitles.includes('proposta')) {
    plan.push('Padronizar proposta, prazos de envio e acompanhamento de fechamento.');
  }

  if (leakTitles.includes('velocidade') || leakTitles.includes('inicio')) {
    plan.push('Definir tempo ideal de resposta, critérios de qualificação e repasse com contexto.');
  }

  while (plan.length < 3) {
    const additions = [
      'Separar percepção de perda e vazamento real por etapa do processo comercial.',
      'Escolher a primeira frente de implantação com maior impacto e menor complexidade.',
      'Definir o KPI de correção antes de implantar qualquer ferramenta.',
    ];
    const next = additions.find((item) => !plan.includes(item));
    if (!next) break;
    plan.push(next);
  }

  return plan.slice(0, 3);
}

function buildCentralDiagnosis(pillars) {
  if (pillars.clareza_processo_comercial < 55) {
    return 'A operação comercial ainda depende demais de execução individual. Antes de implantar IA ou automações, a empresa precisa padronizar a jornada da oportunidade e definir onde a tecnologia entra para reduzir perda de contexto, atraso e falta de acompanhamento.';
  }
  if (pillars.visibilidade_gestao < 55) {
    return 'A operação tem sinais de execução, mas a gestão ainda não enxerga cedo o suficiente onde agir. A prioridade é transformar processo e dados em rotina de correção durante o mês.';
  }
  return 'A operação já tem alguma base comercial, mas precisa priorizar a primeira estrutura que reduz vazamento com processo, inteligência operacional e acompanhamento de adoção.';
}

export function buildFallbackReport(diagnostic = {}) {
  const answers = diagnostic.raw_answers || {};
  const pillarScores = calculatePillarScores(answers);
  const score = calculatePredictabilityScore(answers);
  const fitScore = calculateFitScore(answers);
  const leaks = buildLeaks(answers, pillarScores);
  const contradictions = detectContradictions(answers);
  const recommendedStructure = recommendVamoStructure(answers, pillarScores, leaks);
  const actionPlan = buildActionPlan(answers, leaks);
  const nextStep = classifyCommercialRecommendation(answers, fitScore);
  const level = getOperationLevel(score);

  return {
    score_previsibilidade_comercial: score,
    score_previsibilidade: score,
    score_vendas_previsiveis: score,
    nivel_operacao: level,
    resumo_executivo: 'Seu mapa indica uma operação com vazamentos relevantes de processo e previsibilidade. O problema principal não parece ser apenas gerar mais oportunidades, mas transformar as oportunidades existentes em uma rotina comercial com próxima ação, visibilidade e correção durante o mês.',
    diagnostico_central: buildCentralDiagnosis(pillarScores),
    scores_pilares: pillarScores,
    vazamentos: leaks,
    contradicoes: contradictions,
    estrutura_recomendada: recommendedStructure,
    por_que_nao_comecar_pela_ferramenta: 'Começar pela ferramenta agora aumentaria o risco de automatizar um processo que ainda não está claro. A primeira decisão precisa ser sobre o gargalo comercial certo: o que medir, onde agir, quem usa e qual rotina sustenta a implantação.',
    recomendacao_imediata: actionPlan[0] || 'Validar o mapa e priorizar a primeira estrutura comercial antes de implantar qualquer ferramenta.',
    plano_acao: actionPlan,
    fit_vamo_score: fitScore,
    recomendacao_comercial: nextStep,
    mensagem_cta: 'A VAMO pode validar esse mapa e mostrar qual estrutura deve ser implantada primeiro para reduzir vazamentos comerciais sem começar pela ferramenta errada.',
  };
}

export function normalizeReport(report, diagnostic = {}) {
  const fallback = buildFallbackReport(diagnostic);
  const oldPillars = report?.scores_pilares || {};
  const normalized = {
    ...fallback,
    ...(report || {}),
    scores_pilares: {
      ...fallback.scores_pilares,
      ...(report?.scores_pilares || {}),
    },
  };

  normalized.scores_pilares = {
    clareza_processo_comercial: clamp(normalized.scores_pilares.clareza_processo_comercial ?? oldPillars.previsibilidade_comercial ?? fallback.scores_pilares.clareza_processo_comercial),
    aproveitamento_oportunidades: clamp(normalized.scores_pilares.aproveitamento_oportunidades ?? fallback.scores_pilares.aproveitamento_oportunidades),
    continuidade_comercial: clamp(normalized.scores_pilares.continuidade_comercial ?? oldPillars.velocidade_followup ?? fallback.scores_pilares.continuidade_comercial),
    visibilidade_gestao: clamp(normalized.scores_pilares.visibilidade_gestao ?? oldPillars.gestao_funil_crm ?? fallback.scores_pilares.visibilidade_gestao),
    rotina_previsibilidade: clamp(normalized.scores_pilares.rotina_previsibilidade ?? oldPillars.previsibilidade_comercial ?? fallback.scores_pilares.rotina_previsibilidade),
    adocao_operacional: clamp(normalized.scores_pilares.adocao_operacional ?? oldPillars.processo_adocao ?? fallback.scores_pilares.adocao_operacional),
    prioridade_implantacao: clamp(normalized.scores_pilares.prioridade_implantacao ?? oldPillars.clareza_prioridade ?? fallback.scores_pilares.prioridade_implantacao),
  };

  normalized.score_previsibilidade_comercial = clamp(
    report?.score_previsibilidade_comercial ??
    report?.score_previsibilidade ??
    report?.score_vendas_previsiveis ??
    fallback.score_previsibilidade_comercial
  );
  normalized.score_previsibilidade = normalized.score_previsibilidade_comercial;
  normalized.score_vendas_previsiveis = normalized.score_previsibilidade_comercial;
  normalized.fit_vamo_score = clamp(normalized.fit_vamo_score);
  normalized.nivel_operacao = normalized.nivel_operacao || getOperationLevel(normalized.score_previsibilidade_comercial);
  normalized.vazamentos = Array.isArray(normalized.vazamentos) && normalized.vazamentos.length ? normalized.vazamentos.slice(0, 3) : fallback.vazamentos;
  while (normalized.vazamentos.length < 3) {
    normalized.vazamentos.push(fallback.vazamentos[normalized.vazamentos.length]);
  }
  normalized.contradicoes = Array.isArray(normalized.contradicoes) ? normalized.contradicoes : fallback.contradicoes;
  normalized.estrutura_recomendada = normalized.estrutura_recomendada || fallback.estrutura_recomendada;
  normalized.diagnostico_central = normalized.diagnostico_central || fallback.diagnostico_central;
  normalized.por_que_nao_comecar_pela_ferramenta = normalized.por_que_nao_comecar_pela_ferramenta || fallback.por_que_nao_comecar_pela_ferramenta;
  normalized.recomendacao_imediata = normalized.recomendacao_imediata || fallback.recomendacao_imediata;
  normalized.plano_acao = Array.isArray(normalized.plano_acao) && normalized.plano_acao.length ? normalized.plano_acao.slice(0, 3) : fallback.plano_acao;

  const recommendation = normalize(normalized.recomendacao_comercial);
  normalized.recomendacao_comercial = ['reuniao imediata', 'nutricao estrategica', 'sem fit agora'].includes(recommendation)
    ? recommendation.replace('reuniao', 'reunião').replace('nutricao estrategica', 'nutrição estratégica')
    : classifyCommercialRecommendation(diagnostic.raw_answers || {}, normalized.fit_vamo_score);
  normalized.mensagem_cta = normalized.mensagem_cta || fallback.mensagem_cta;

  return normalized;
}
