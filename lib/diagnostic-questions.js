export const REQUIRED_SLOTS = [
  'seller_count',
  'segment',
  'main_sales_channel',
  'lead_source',
  'predictability_level',
  'main_sales_leak',
  'followup_consistency',
  'crm_visibility',
  'process_adoption',
  'implementation_urgency',
];

export const DIAGNOSTIC_BLOCKS = [
  {
    id: 'contexto_comercial',
    title: 'Contexto comercial',
    insight: 'Com esse contexto, a VAMO entende o tamanho da operação, o tipo de venda e onde os vazamentos podem aparecer com mais força.',
  },
  {
    id: 'entrada_oportunidades',
    title: 'Entrada de oportunidades',
    insight: 'Antes de falar em mais leads, é preciso entender de onde as oportunidades vêm e se elas chegam com contexto suficiente para o time vender.',
  },
  {
    id: 'previsibilidade',
    title: 'Previsibilidade comercial',
    insight: 'Quando o gestor só entende o resultado no fim do mês, a correção chega tarde e parte das vendas já escapou.',
  },
  {
    id: 'vazamentos_funil',
    title: 'Vazamentos do funil',
    insight: 'Aqui a análise separa falta de demanda de perda no aproveitamento das oportunidades que já chegam.',
  },
  {
    id: 'rotina_followup',
    title: 'Rotina e follow-up',
    insight: 'Muitas vendas não são perdidas por falta de interesse do cliente, mas por falta de velocidade, contexto e acompanhamento.',
  },
  {
    id: 'gestao_crm',
    title: 'Gestão, CRM e visibilidade',
    insight: 'CRM parado, planilha manual e gestão por feeling impedem o gestor de agir antes do mês acabar.',
  },
  {
    id: 'processo_tecnologia',
    title: 'Processo e tecnologia',
    insight: 'IA sem processo não resolve o comercial. Ela apenas acelera uma operação que ainda não está estruturada.',
  },
  {
    id: 'prioridade_implantacao',
    title: 'Prioridade de implantação',
    insight: 'A prioridade mostra se a empresa precisa de uma leitura inicial, de uma correção rápida ou de uma implantação comercial mais completa.',
  },
  {
    id: 'contato',
    title: 'Contato',
    insight: 'Com os dados principais preenchidos, a VAMO consegue salvar o mapa e enviar uma leitura personalizada do vazamento comercial.',
  },
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'seller_count',
    slot: 'seller_count',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Quantas pessoas atuam diretamente em vendas hoje?',
    helper: 'Considere vendedores, SDRs, closers, atendimento comercial e pessoas que fazem follow-up.',
    options: ['1 a 2', '3 a 5', '6 a 10', '11 a 20', '21+'],
    column: 'seller_count',
  },
  {
    id: 'segment',
    slot: 'segment',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Qual segmento descreve melhor sua empresa?',
    options: ['Serviços B2B', 'Educação/cursos', 'Imobiliária', 'Saúde/clínicas', 'Energia solar', 'Consórcio/financeiro', 'Distribuição/indústria', 'Varejo com time comercial', 'Outro'],
    column: 'segment',
  },
  {
    id: 'main_sales_channel',
    slot: 'main_sales_channel',
    blockId: 'entrada_oportunidades',
    type: 'button',
    question: 'Onde a maior parte das conversas comerciais acontece hoje?',
    helper: 'A VAMO usa isso para entender onde a venda realmente acontece, não apenas onde o lead é captado.',
    options: ['WhatsApp', 'Ligação', 'Instagram/direct', 'CRM', 'Presencial', 'E-mail', 'Misto'],
    column: 'sales_channel',
  },
  {
    id: 'lead_source',
    slot: 'lead_source',
    blockId: 'entrada_oportunidades',
    type: 'button',
    question: 'De onde vêm as principais oportunidades comerciais hoje?',
    options: ['Tráfego pago', 'Indicação', 'Prospecção ativa', 'Orgânico/redes sociais', 'Base antiga', 'Equipe externa', 'Misto', 'Não sei medir'],
  },
  {
    id: 'predictability_level',
    slot: 'predictability_level',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Antes do fim do mês, você consegue prever se o time vai bater a meta?',
    options: ['Sim, com clareza', 'Mais ou menos', 'Só perto do fechamento', 'Não tenho essa visão'],
  },
  {
    id: 'main_sales_leak',
    slot: 'main_sales_leak',
    blockId: 'vazamentos_funil',
    type: 'button',
    question: 'Onde você sente que mais perde vendas hoje?',
    helper: 'Não precisa ser a resposta perfeita. A IA vai cruzar isso com as próximas perguntas para separar percepção de vazamento real.',
    options: ['Falta de lead qualificado', 'Demora no primeiro atendimento', 'Falta de follow-up', 'Baixa conversão em reunião/proposta', 'CRM desatualizado', 'Gestor sem visibilidade', 'Não sei identificar'],
  },
  {
    id: 'followup_consistency',
    slot: 'followup_consistency',
    blockId: 'rotina_followup',
    type: 'button',
    question: 'Quando um lead demonstra interesse, o follow-up acontece com padrão e no tempo certo?',
    helper: 'Aqui queremos entender se o lead quente esfria por falta de resposta, contexto ou continuidade.',
    options: ['Sim, temos cadência clara', 'Acontece, mas depende do vendedor', 'Às vezes esquecemos', 'Não temos padrão', 'Não sei medir'],
  },
  {
    id: 'crm_visibility',
    slot: 'crm_visibility',
    blockId: 'gestao_crm',
    type: 'button',
    question: 'Hoje o gestor consegue ver, em tempo real, quais oportunidades estão paradas e onde agir?',
    options: ['Sim, pelo CRM/dashboard', 'Parcialmente', 'Depende de cobrança manual', 'Não, fica em WhatsApp/planilha', 'Não usamos CRM'],
  },
  {
    id: 'process_adoption',
    slot: 'process_adoption',
    blockId: 'processo_tecnologia',
    type: 'button',
    question: 'Quando vocês tentam implantar processo, CRM ou automação, o time realmente usa no dia a dia?',
    helper: 'Ferramenta sem adoção vira mais uma tela. A VAMO precisa medir se o problema é tecnologia, processo ou uso real.',
    options: ['Sim, usa bem', 'Usa no começo e depois cai', 'Usa parcialmente', 'Quase não usa', 'Ainda não tentamos implantar'],
  },
  {
    id: 'implementation_urgency',
    slot: 'implementation_urgency',
    blockId: 'prioridade_implantacao',
    type: 'button',
    question: 'Qual é a prioridade para corrigir esses vazamentos comerciais?',
    options: ['Alta: próximos 30 dias', 'Média: próximos 60 dias', 'Planejada: próximos 90 dias', 'Sem previsão', 'Só estou pesquisando'],
  },
  {
    id: 'contact_capture',
    blockId: 'contato',
    type: 'contact',
    question: 'Já tenho dados suficientes para montar seu Mapa de Vazamento de Vendas. Para salvar seu resultado e permitir que a VAMO envie uma leitura personalizada, qual WhatsApp podemos usar?',
    helper: 'O e-mail é opcional. O diagnóstico continua mesmo sem ele.',
  },
];

export function getQuestion(questionId) {
  return DIAGNOSTIC_QUESTIONS.find((question) => question.id === questionId) || null;
}

export function getFirstQuestion() {
  return getNextEmptySlotQuestion({});
}

function normalizedAnswer(value) {
  return answerToText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hasAnswer(answers = {}, questionId) {
  return answerToText(answers[questionId]).trim().length > 0;
}

function getNextEmptySlotQuestion(answers = {}) {
  const nextSlot = REQUIRED_SLOTS.find((slot) => !hasAnswer(answers, slot));
  if (nextSlot) return getQuestion(nextSlot);
  if (!hasAnswer(answers, 'contact_capture')) return getQuestion('contact_capture');
  return null;
}

export function getAvailableQuestions(answers = {}) {
  const answeredOrCurrent = new Set(Object.keys(answers || {}));
  const next = getNextEmptySlotQuestion(answers);
  if (next) answeredOrCurrent.add(next.id);
  return DIAGNOSTIC_QUESTIONS.filter((question) => answeredOrCurrent.has(question.id));
}

export function getNextQuestion(_questionId, answers = {}) {
  return getNextEmptySlotQuestion(answers);
}

export function getBlock(blockId) {
  return DIAGNOSTIC_BLOCKS.find((block) => block.id === blockId) || null;
}

export function getProgress(questionId, answers = {}) {
  const answeredRequired = REQUIRED_SLOTS.filter((slot) => hasAnswer(answers, slot)).length;
  const contactAnswered = hasAnswer(answers, 'contact_capture') ? 1 : 0;
  const currentBonus = questionId === 'contact_capture' ? 0.5 : 0;
  return Math.max(0, Math.min(100, Math.round(((answeredRequired + contactAnswered + currentBonus) / (REQUIRED_SLOTS.length + 1)) * 100)));
}

export function getCompletionProgress() {
  return 100;
}

function adaptQuestion(question, answers = {}) {
  if (!question) return null;
  const sellerCount = normalizedAnswer(answers.seller_count);
  const segment = normalizedAnswer(answers.segment);
  const mainLeak = normalizedAnswer(answers.main_sales_leak);

  if (question.id === 'segment' && sellerCount.includes('1 a 2')) {
    return 'Com um time menor, vou olhar mais para dependência do dono, velocidade de atendimento e rotina mínima de follow-up. Qual segmento descreve melhor sua empresa?';
  }

  if (question.id === 'segment' && (sellerCount.includes('11') || sellerCount.includes('21'))) {
    return 'Com esse tamanho de time, os vazamentos costumam aparecer em visibilidade, padrão de execução e gestão por etapa. Qual é o segmento da empresa?';
  }

  if (question.id === 'main_sales_channel' && segment.includes('b2b')) {
    return 'Em vendas B2B, o vazamento costuma aparecer no ciclo comercial, no follow-up e na previsibilidade de fechamento. Onde a maior parte das conversas comerciais acontece hoje?';
  }

  if (question.id === 'main_sales_channel' && segment.includes('imobiliaria')) {
    return 'Em operações imobiliárias, velocidade de atendimento e retomada de interessados pesam muito. Onde a maior parte das conversas comerciais acontece hoje?';
  }

  if (question.id === 'followup_consistency' && mainLeak.includes('falta de lead')) {
    return 'Mesmo quando parece faltar lead qualificado, preciso separar geração de demanda de aproveitamento das oportunidades que já chegam. Quando um lead demonstra interesse, o follow-up acontece com padrão e no tempo certo?';
  }

  return question.question;
}

export function toPublicQuestion(question, answers = {}) {
  if (!question) return null;
  const questionIndex = DIAGNOSTIC_QUESTIONS.findIndex((item) => item.id === question.id);
  return {
    id: question.id,
    slot: question.slot || null,
    blockId: question.blockId,
    type: question.type,
    question: adaptQuestion(question, answers),
    helper: question.helper || null,
    placeholder: question.placeholder || null,
    options: question.options || [],
    progress: getProgress(question.id, answers),
    position: Math.max(1, questionIndex + 1),
    total: DIAGNOSTIC_QUESTIONS.length,
    estimatedTime: '3 a 5 min',
  };
}

export function getAdaptiveMessage(questionId, answers = {}) {
  const normalized = normalizedAnswer(answers[questionId]);

  if (questionId === 'seller_count' && normalized.includes('1 a 2')) {
    return 'Entendi. Em times pequenos, o vazamento normalmente aparece na dependência do dono, na falta de rotina e na perda de contexto entre uma conversa e outra.';
  }

  if (questionId === 'seller_count' && (normalized.includes('11') || normalized.includes('21'))) {
    return 'Com esse tamanho de time, o risco geralmente não está só em vender mais, mas em enxergar onde cada etapa trava antes do fechamento.';
  }

  if (questionId === 'segment' && normalized.includes('imobiliaria')) {
    return 'Em operações imobiliárias, velocidade de atendimento e retomada consistente costumam pesar muito no aproveitamento dos interessados.';
  }

  if (questionId === 'segment' && normalized.includes('b2b')) {
    return 'Em vendas B2B, o vazamento normalmente aparece no ciclo comercial, no follow-up e na previsibilidade de fechamento.';
  }

  if (questionId === 'main_sales_leak' && normalized.includes('falta de lead')) {
    return 'Boa leitura. Ainda assim, vou checar se os leads que já chegam estão sendo aproveitados até o fechamento, porque muita empresa busca mais demanda antes de corrigir o funil.';
  }

  if (questionId === 'crm_visibility' && (normalized.includes('whatsapp') || normalized.includes('planilha') || normalized.includes('nao usamos'))) {
    return 'Esse é um sinal importante. Quando a gestão depende de WhatsApp, planilha ou cobrança manual, o gestor normalmente só percebe o vazamento tarde demais.';
  }

  if (questionId === 'process_adoption' && (normalized.includes('depois cai') || normalized.includes('parcialmente') || normalized.includes('quase nao usa'))) {
    return 'Aqui aparece um ponto central: o problema pode não ser só tecnologia, mas adoção. Ferramenta sem processo vira mais uma tela esquecida.';
  }

  return null;
}

export function hasRequiredSlots(answers = {}) {
  return REQUIRED_SLOTS.every((slot) => hasAnswer(answers, slot));
}

export function answerToText(answer) {
  if (answer == null) return '';
  if (typeof answer === 'string') return answer;
  if (typeof answer === 'object') {
    const parts = [];
    if (answer.whatsapp) parts.push(`WhatsApp: ${answer.whatsapp}`);
    if (answer.email) parts.push(`E-mail: ${answer.email}`);
    if (answer.choice) parts.push(answer.choice);
    if (answer.text) parts.push(answer.text);
    return parts.join(' | ') || JSON.stringify(answer);
  }
  return String(answer);
}
