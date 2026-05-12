export const REQUIRED_SLOTS = [
  'seller_count',
  'segment',
  'sales_channel',
  'predictability_level',
  'main_sales_leak',
  'followup_loss',
  'incentive_model',
  'urgency',
];

export const DIAGNOSTIC_BLOCKS = [
  {
    id: 'contexto_comercial',
    title: 'Contexto comercial',
    insight: 'Com esse contexto, já dá para localizar se o vazamento parece estar no tamanho da operação, no canal ou na rotina comercial.',
  },
  {
    id: 'previsibilidade',
    title: 'Previsibilidade',
    insight: 'Quando a visão de fechamento aparece tarde, a operação tende a corrigir depois que parte das vendas já escapou.',
  },
  {
    id: 'vazamentos',
    title: 'Vazamentos de vendas',
    insight: 'Aqui a análise separa falta de demanda de perda no aproveitamento das oportunidades que já chegam.',
  },
  {
    id: 'incentivo',
    title: 'Incentivo comercial',
    insight: 'O incentivo precisa ajudar o time a manter ritmo durante o mês, não apenas registrar pagamento no fechamento.',
  },
  {
    id: 'prioridade',
    title: 'Prioridade',
    insight: 'A janela de correção ajuda a VAMO entender se existe urgência real para atacar os vazamentos agora.',
  },
  {
    id: 'contato',
    title: 'Contato',
    insight: 'Com os dados principais preenchidos, o resultado já pode ser salvo e enviado para uma leitura personalizada.',
  },
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'seller_count',
    slot: 'seller_count',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Quantas pessoas atuam diretamente em vendas hoje?',
    options: ['1 a 2', '3 a 5', '6 a 10', '11 a 20', '21+'],
    column: 'seller_count',
  },
  {
    id: 'segment',
    slot: 'segment',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Qual segmento descreve melhor sua empresa?',
    options: ['Serviços B2B', 'Educação/cursos', 'Imobiliária', 'Energia solar', 'Saúde/clínicas', 'Consórcio/financeiro', 'Distribuição/indústria', 'Outro'],
    column: 'segment',
  },
  {
    id: 'sales_channel',
    slot: 'sales_channel',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Onde a maior parte das vendas acontece hoje?',
    options: ['WhatsApp', 'Ligação', 'Presencial', 'CRM', 'Instagram/redes sociais', 'Misto'],
    column: 'sales_channel',
  },
  {
    id: 'predictability_level',
    slot: 'predictability_level',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Antes do fechamento, você consegue prever se o time vai bater a meta?',
    options: ['Sim, com clareza', 'Mais ou menos', 'Só perto do fechamento', 'Não tenho essa visão'],
  },
  {
    id: 'main_sales_leak',
    slot: 'main_sales_leak',
    blockId: 'vazamentos',
    type: 'button',
    question: 'Onde você sente que mais perde vendas hoje?',
    options: ['Falta de lead', 'Falta de follow-up', 'Baixa conversão', 'Vendedor sem ritmo', 'Falta de gestão', 'Não sei identificar'],
  },
  {
    id: 'followup_loss',
    slot: 'followup_loss',
    blockId: 'vazamentos',
    type: 'button',
    question: 'Mesmo quando os leads chegam, existe perda por falta de acompanhamento até o fechamento?',
    helper: 'Não estamos avaliando apenas se chegam leads. Estamos avaliando se as oportunidades que já chegam são aproveitadas até o fechamento.',
    options: ['Sim, acontece com frequência', 'Às vezes', 'Raramente', 'Não sei medir', 'Não acontece'],
  },
  {
    id: 'incentive_model',
    slot: 'incentive_model',
    blockId: 'incentivo',
    type: 'button',
    question: 'Como seu time é incentivado a vender mais hoje?',
    options: ['Comissão clara', 'Comissão em planilha/manual', 'Premiação/meta', 'Apenas salário fixo', 'Não temos modelo claro'],
  },
  {
    id: 'urgency',
    slot: 'urgency',
    blockId: 'prioridade',
    type: 'button',
    question: 'Em quanto tempo você quer corrigir esses vazamentos?',
    options: ['Agora / próximos 30 dias', 'Próximos 60 dias', 'Próximos 90 dias', 'Sem previsão', 'Só estou pesquisando'],
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
    return 'Com um time menor, vou olhar mais para dependência do dono e rotina comercial. Em qual segmento vocês vendem?';
  }

  if (question.id === 'segment' && (sellerCount.includes('11') || sellerCount.includes('21'))) {
    return 'Com esse tamanho de time, os vazamentos podem aparecer em acompanhamento individual e previsibilidade. Qual é o segmento da empresa?';
  }

  if (question.id === 'sales_channel' && segment.includes('imobiliaria')) {
    return 'Em operações imobiliárias, atendimento e retorno rápido pesam muito. Onde a maior parte das vendas acontece hoje?';
  }

  if (question.id === 'sales_channel' && segment.includes('b2b')) {
    return 'Em vendas B2B, o vazamento costuma aparecer no ciclo comercial e no follow-up. Qual é o principal canal de venda hoje?';
  }

  if (question.id === 'followup_loss' && mainLeak.includes('falta de lead')) {
    return 'Mesmo quando o principal problema parece ser falta de lead, preciso separar demanda de aproveitamento. Os leads que chegam se perdem por falta de acompanhamento até o fechamento?';
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
    return 'Entendi. Com um time menor, o risco normalmente não está em complexidade de gestão, mas em dependência do dono e falta de rotina comercial.';
  }

  if (questionId === 'seller_count' && (normalized.includes('11') || normalized.includes('21'))) {
    return 'Com esse tamanho de time, os vazamentos mais perigosos costumam aparecer em previsibilidade, acompanhamento individual e follow-up.';
  }

  if (questionId === 'segment' && normalized.includes('imobiliaria')) {
    return 'Em operações imobiliárias, boa parte das vendas pode escapar no atendimento, retorno e acompanhamento dos interessados.';
  }

  if (questionId === 'segment' && normalized.includes('b2b')) {
    return 'Em vendas B2B, o vazamento normalmente aparece no ciclo comercial, follow-up e previsibilidade de fechamento.';
  }

  if (questionId === 'main_sales_leak' && normalized.includes('falta de lead')) {
    return 'Boa leitura. Ainda assim, vou checar se as oportunidades que já chegam estão sendo aproveitadas até o fechamento.';
  }

  if (questionId === 'incentive_model' && (normalized.includes('salario fixo') || normalized.includes('modelo claro'))) {
    return 'Entendi. Vou tratar isso como modelo de incentivo comercial pouco estruturado, sem forçar uma leitura de comissão que não existe hoje.';
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
