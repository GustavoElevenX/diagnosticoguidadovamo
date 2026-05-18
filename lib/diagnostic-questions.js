export const REQUIRED_SLOTS = [
  'seller_count',
  'business_model',
  'commercial_process_clarity',
  'opportunity_handling',
  'sales_bottleneck',
  'next_step_discipline',
  'management_visibility',
  'commercial_routine',
  'process_technology_adoption',
  'implementation_priority',
];

export const DIAGNOSTIC_BLOCKS = [
  {
    id: 'operacao_comercial',
    title: 'Operação comercial',
    insight: 'Antes de falar em tecnologia ou automação, a VAMO precisa entender como a venda acontece hoje e qual é o nível de complexidade da operação.',
  },
  {
    id: 'processo_real',
    title: 'Processo real de vendas',
    insight: 'Aqui a leitura separa empresas que têm um processo comercial claro daquelas que ainda dependem de memória, improviso ou cobrança manual.',
  },
  {
    id: 'aproveitamento_oportunidades',
    title: 'Aproveitamento das oportunidades',
    insight: 'Nem toda perda vem da falta de lead. Muitas vendas escapam porque a oportunidade não recebe velocidade, contexto ou próxima ação clara.',
  },
  {
    id: 'vazamento_principal',
    title: 'Vazamento principal',
    insight: 'Este bloco identifica onde a operação comercial perde mais força: entrada, qualificação, proposta, follow-up, gestão, previsibilidade ou pós-venda.',
  },
  {
    id: 'continuidade_comercial',
    title: 'Continuidade comercial',
    insight: 'Uma venda raramente se perde em um único ponto. Normalmente ela escapa quando não existe disciplina de próxima ação, retomada e acompanhamento.',
  },
  {
    id: 'gestao_previsibilidade',
    title: 'Gestão e previsibilidade',
    insight: 'O gestor precisa enxergar onde agir antes do mês acabar. Quando a visibilidade chega tarde, a correção também chega tarde.',
  },
  {
    id: 'adocao_operacional',
    title: 'Adoção operacional',
    insight: 'Ferramenta sem processo vira mais uma tela. Processo sem uso real vira intenção. A VAMO mede se a estrutura consegue entrar na rotina do time.',
  },
  {
    id: 'prioridade_implantacao',
    title: 'Prioridade de implantação',
    insight: 'A prioridade mostra qual frente deve ser implantada primeiro para gerar correção real, sem tentar resolver tudo de uma vez.',
  },
  {
    id: 'contato',
    title: 'Contato',
    insight: 'Com os dados principais preenchidos, a VAMO consegue salvar o mapa e enviar uma leitura personalizada com a prioridade de implantação.',
  },
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'seller_count',
    slot: 'seller_count',
    blockId: 'operacao_comercial',
    type: 'button',
    question: 'Quantas pessoas atuam diretamente no comercial hoje?',
    helper: 'Considere quem prospecta, atende, qualifica, vende, faz proposta, acompanha oportunidades ou fecha negócios.',
    options: ['1 a 2', '3 a 5', '6 a 10', '11 a 20', '21+'],
    column: 'seller_count',
  },
  {
    id: 'business_model',
    slot: 'business_model',
    blockId: 'operacao_comercial',
    type: 'button',
    question: 'Qual modelo descreve melhor a venda da sua empresa?',
    helper: 'A ideia aqui não é classificar segmento. É entender como a venda acontece e qual nível de processo ela exige.',
    options: [
      'Venda consultiva B2B',
      'Serviço local com atendimento comercial',
      'Produto ou serviço de ticket recorrente',
      'Venda por proposta/orçamento',
      'Venda com SDR e closer',
      'Venda pelo dono ou sócios',
      'Venda com equipe externa',
      'Outro modelo',
    ],
    column: 'business_model',
  },
  {
    id: 'commercial_process_clarity',
    slot: 'commercial_process_clarity',
    blockId: 'processo_real',
    type: 'button',
    question: 'Hoje o caminho da venda, do primeiro contato até o fechamento, está claro para todo o time?',
    helper: 'Não estamos falando de ter uma ferramenta. Estamos falando de processo: etapas, responsáveis, critérios e próxima ação.',
    options: [
      'Sim, temos etapas claras e o time segue',
      'Temos etapas, mas cada pessoa executa de um jeito',
      'Existe uma noção geral, mas não está padronizado',
      'Fica muito na cabeça do dono ou gestor',
      'Não temos um processo comercial claro',
    ],
    column: 'commercial_process_clarity',
  },
  {
    id: 'opportunity_handling',
    slot: 'opportunity_handling',
    blockId: 'aproveitamento_oportunidades',
    type: 'button',
    question: 'Quando uma nova oportunidade aparece, o que acontece na prática?',
    helper: 'Essa resposta mostra se a empresa tem velocidade e contexto logo no início ou se a oportunidade já começa com risco de esfriar.',
    options: [
      'Ela entra em uma rotina clara de atendimento e acompanhamento',
      'Alguém atende, mas o padrão depende da pessoa',
      'Às vezes demora para alguém assumir',
      'O atendimento acontece, mas o contexto se perde depois',
      'Não temos controle claro do que acontece com cada oportunidade',
    ],
    column: 'opportunity_handling',
  },
  {
    id: 'sales_bottleneck',
    slot: 'sales_bottleneck',
    blockId: 'vazamento_principal',
    type: 'button',
    question: 'Em qual parte da operação comercial você sente mais perda hoje?',
    helper: 'Escolha a opção mais próxima. A IA vai cruzar com as outras respostas para separar percepção de vazamento real.',
    options: [
      'Atrair oportunidades com perfil certo',
      'Responder rápido e com contexto',
      'Qualificar melhor antes de passar para venda',
      'Transformar interesse em reunião ou proposta',
      'Retomar oportunidades que esfriam',
      'Enxergar onde o funil trava antes do fim do mês',
      'Manter padrão de execução no time',
      'Não sei identificar com clareza',
    ],
    column: 'sales_bottleneck',
  },
  {
    id: 'next_step_discipline',
    slot: 'next_step_discipline',
    blockId: 'continuidade_comercial',
    type: 'button',
    question: 'Depois que o cliente demonstra interesse, existe disciplina clara de próxima ação?',
    helper: 'Aqui a análise mede se cada oportunidade tem dono, prazo, contexto e retomada definidos.',
    options: [
      'Sim, toda oportunidade tem próximo passo definido',
      'Na maioria das vezes, mas ainda depende do vendedor',
      'Só acompanhamos melhor as oportunidades mais quentes',
      'Muitas oportunidades ficam sem retomada clara',
      'Não conseguimos medir isso hoje',
    ],
    column: 'next_step_discipline',
  },
  {
    id: 'management_visibility',
    slot: 'management_visibility',
    blockId: 'gestao_previsibilidade',
    type: 'button',
    question: 'O gestor consegue saber, antes do fim do mês, onde precisa agir para não perder resultado?',
    helper: 'A pergunta não é se existe dashboard bonito. É se existe visibilidade útil para corrigir a operação a tempo.',
    options: [
      'Sim, temos visão clara e ação durante o mês',
      'Temos alguns dados, mas a leitura ainda é manual',
      'Só percebemos os problemas perto do fechamento',
      'Dependemos de perguntar para o time ou olhar conversas',
      'Não temos essa visão hoje',
    ],
    column: 'management_visibility',
  },
  {
    id: 'commercial_routine',
    slot: 'commercial_routine',
    blockId: 'gestao_previsibilidade',
    type: 'button',
    question: 'Existe uma rotina comercial para revisar oportunidades, gargalos e ações da semana?',
    helper: 'Previsibilidade não vem só de ferramenta. Ela depende de rotina de gestão e correção contínua.',
    options: [
      'Sim, com frequência e padrão claro',
      'Acontece, mas sem muita profundidade',
      'Acontece só quando o resultado aperta',
      'Depende do gestor lembrar e cobrar',
      'Não existe rotina comercial estruturada',
    ],
    column: 'commercial_routine',
  },
  {
    id: 'process_technology_adoption',
    slot: 'process_technology_adoption',
    blockId: 'adocao_operacional',
    type: 'button',
    question: 'Quando vocês implantam processo, sistema ou automação, o time realmente usa no dia a dia?',
    helper: 'A VAMO precisa medir adoção porque implantação só vale quando vira rotina real, não quando vira mais uma tela esquecida.',
    options: [
      'Sim, o time usa e a gestão acompanha',
      'Usa no começo, mas perde força depois',
      'Parte do time usa e parte ignora',
      'Já tentamos e não virou rotina',
      'Ainda não tentamos implantar algo estruturado',
    ],
    column: 'process_technology_adoption',
  },
  {
    id: 'implementation_priority',
    slot: 'implementation_priority',
    blockId: 'prioridade_implantacao',
    type: 'button',
    question: 'Se a VAMO fosse priorizar uma primeira estrutura, qual resultado faria mais sentido agora?',
    helper: 'A resposta final vai indicar a frente de implantação mais provável, sem vender ferramenta antes do diagnóstico.',
    options: [
      'Mais velocidade no atendimento e qualificação',
      'Menos oportunidades esquecidas ou sem retomada',
      'Mais visibilidade para o gestor agir durante o mês',
      'Mais padrão comercial entre as pessoas do time',
      'Propostas mais rápidas e melhor acompanhamento de fechamento',
      'Organizar o processo antes de qualquer tecnologia',
      'Ainda não sei o que priorizar',
    ],
    column: 'implementation_priority',
  },
  {
    id: 'contact_capture',
    blockId: 'contato',
    type: 'contact',
    question: 'Já tenho dados suficientes para montar seu Mapa de Vazamento de Vendas. Para salvar seu resultado e a VAMO enviar uma leitura personalizada, qual WhatsApp podemos usar?',
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
  const businessModel = normalizedAnswer(answers.business_model);
  const processClarity = normalizedAnswer(answers.commercial_process_clarity);
  const bottleneck = normalizedAnswer(answers.sales_bottleneck);
  const visibility = normalizedAnswer(answers.management_visibility);

  if (question.id === 'business_model' && sellerCount.includes('1 a 2')) {
    return 'Com um time menor, o vazamento normalmente aparece na dependência do dono, na falta de rotina e na perda de contexto entre conversas. Qual modelo descreve melhor a venda da sua empresa?';
  }

  if (question.id === 'business_model' && (sellerCount.includes('11') || sellerCount.includes('21'))) {
    return 'Com esse tamanho de time, o risco costuma estar menos na falta de esforço e mais na falta de padrão, visibilidade e correção a tempo. Qual modelo descreve melhor a venda da sua empresa?';
  }

  if (question.id === 'commercial_process_clarity' && businessModel.includes('consultiva')) {
    return 'Em venda consultiva, o processo pesa muito porque a venda depende de contexto, próxima ação e continuidade. Hoje o caminho da venda, do primeiro contato até o fechamento, está claro para todo o time?';
  }

  if (question.id === 'commercial_process_clarity' && businessModel.includes('dono')) {
    return 'Quando a venda depende do dono ou dos sócios, o principal risco é a operação não escalar o padrão de quem vende melhor. Hoje o caminho da venda está claro para todo o time?';
  }

  if (question.id === 'opportunity_handling' && /nao temos|cabeca|nao esta padronizado/.test(processClarity)) {
    return 'Aqui já aparece um possível vazamento: quando o processo não está claro, cada oportunidade depende demais de memória, improviso ou cobrança manual. Quando uma nova oportunidade aparece, o que acontece na prática?';
  }

  if (question.id === 'next_step_discipline' && /retomar|esfriam|interesse|proposta/.test(bottleneck)) {
    return 'Esse ponto costuma esconder venda perdida. O cliente até demonstra interesse, mas a operação não garante a próxima ação no tempo certo. Depois que o cliente demonstra interesse, existe disciplina clara de próxima ação?';
  }

  if (question.id === 'management_visibility' && /nao sei|gestor|funil|trava/.test(bottleneck)) {
    return 'Se a empresa não sabe onde o funil trava, o gestor corrige tarde demais. O gestor consegue saber, antes do fim do mês, onde precisa agir para não perder resultado?';
  }

  if (question.id === 'commercial_routine' && /nao temos|perto do fechamento|perguntar|conversas/.test(visibility)) {
    return 'Quando a visibilidade depende de perguntar ou olhar conversa por conversa, a gestão vira reação. Existe uma rotina comercial para revisar oportunidades, gargalos e ações da semana?';
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

export function getAnswerInsight(questionId, answerValue) {
  const normalized = normalizedAnswer(answerValue);

  if (questionId === 'seller_count') {
    if (normalized.includes('1 a 2')) {
      return 'Em times pequenos, o risco principal costuma ser dependência do dono e falta de rotina mínima para não perder oportunidades.';
    }
    if (normalized.includes('11') || normalized.includes('21')) {
      return 'Em times maiores, o vazamento geralmente aparece em falta de padrão, baixa visibilidade e correção tardia do gestor.';
    }
    return 'Esse tamanho de operação já permite identificar se a venda depende mais de pessoas específicas ou de um processo comercial repetível.';
  }

  if (questionId === 'business_model') {
    if (normalized.includes('consultiva')) {
      return 'Venda consultiva exige contexto e continuidade. Sem processo, o valor percebido pelo cliente se perde entre uma interação e outra.';
    }
    if (normalized.includes('proposta') || normalized.includes('orcamento')) {
      return 'Quando a venda depende de proposta, o vazamento costuma aparecer entre interesse, envio, retomada e fechamento.';
    }
    if (normalized.includes('dono')) {
      return 'Quando o dono concentra a venda, a empresa até consegue vender, mas tem dificuldade para transformar esse padrão em operação.';
    }
    return 'O modelo de venda define onde a operação precisa de mais estrutura: entrada, qualificação, proposta, acompanhamento ou gestão.';
  }

  if (questionId === 'commercial_process_clarity') {
    if (/cada pessoa|nocao geral|cabeca|nao temos/.test(normalized)) {
      return 'Esse é um sinal forte de vazamento de processo. Antes de automatizar, é preciso definir como a venda deveria acontecer.';
    }
    return 'Processo claro reduz dependência de improviso e cria base para IA, automação e gestão funcionarem de verdade.';
  }

  if (questionId === 'opportunity_handling') {
    if (/depende|demora|contexto se perde|nao temos controle/.test(normalized)) {
      return 'Aqui pode existir perda logo no início da jornada. Oportunidade sem dono, contexto ou velocidade tende a esfriar antes de virar venda.';
    }
    return 'Quando a oportunidade entra em uma rotina clara, a empresa ganha velocidade e reduz perda invisível no início do funil.';
  }

  if (questionId === 'sales_bottleneck') {
    if (normalized.includes('perfil certo')) {
      return 'Pode existir um problema de entrada, mas a análise ainda precisa validar se as oportunidades atuais estão sendo aproveitadas até o fechamento.';
    }
    if (normalized.includes('responder rapido')) {
      return 'Velocidade sem contexto não sustenta venda consultiva. O ponto é responder rápido e conduzir o próximo passo corretamente.';
    }
    if (normalized.includes('retomar')) {
      return 'Esse é um dos vazamentos mais comuns: o cliente demonstra interesse, mas a empresa não sustenta acompanhamento até a decisão.';
    }
    if (normalized.includes('funil trava')) {
      return 'Quando o gestor não enxerga o travamento antes do fim do mês, a operação perde a chance de corrigir o resultado a tempo.';
    }
    return 'Esse ponto vai orientar qual estrutura da VAMO deve ser priorizada no relatório final.';
  }

  if (questionId === 'next_step_discipline') {
    if (/depende|quentes|sem retomada|nao conseguimos medir/.test(normalized)) {
      return 'Esse é um vazamento de continuidade. A venda não termina quando o cliente demonstra interesse; ela depende de próxima ação clara.';
    }
    return 'Disciplina de próxima ação aumenta previsibilidade porque cada oportunidade passa a ter dono, prazo e contexto.';
  }

  if (questionId === 'management_visibility') {
    if (/manual|perto do fechamento|perguntar|conversas|nao temos/.test(normalized)) {
      return 'Esse é um sinal de baixa previsibilidade. Quando o gestor só enxerga tarde, a correção chega depois que a venda já escapou.';
    }
    return 'Visibilidade útil permite agir durante o mês, não apenas explicar o resultado depois.';
  }

  if (questionId === 'commercial_routine') {
    if (/sem muita profundidade|resultado aperta|lembrar|nao existe/.test(normalized)) {
      return 'Sem rotina comercial, a gestão vira reação. A operação precisa de cadência para revisar gargalos e corrigir antes do resultado fechar.';
    }
    return 'Rotina comercial bem executada transforma dados em ação e evita que o time dependa só de cobrança pontual.';
  }

  if (questionId === 'process_technology_adoption') {
    if (/perde forca|ignora|nao virou rotina|ainda nao tentamos/.test(normalized)) {
      return 'Esse ponto é decisivo para a VAMO. Implantação só tem valor quando o processo entra na rotina real do time.';
    }
    return 'Boa adoção aumenta a chance de qualquer estrutura implantada virar resultado sustentável, não pico de primeira semana.';
  }

  if (questionId === 'implementation_priority') {
    return 'Perfeito. Agora a análise vai cruzar operação, vazamento, visibilidade e adoção para indicar a primeira frente de implantação mais coerente.';
  }

  return null;
}

export function getAdaptiveMessage(questionId, answers = {}) {
  return getAnswerInsight(questionId, answers[questionId]);
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
