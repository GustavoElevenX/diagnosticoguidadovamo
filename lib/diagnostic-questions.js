export const DIAGNOSTIC_BLOCKS = [
  {
    id: 'contexto_comercial',
    title: 'Contexto comercial',
    insight: 'Com esse contexto inicial, normalmente os principais riscos aparecem em acompanhamento de meta, clareza de comissão e capacidade de corrigir o time antes do mês fechar. Vou investigar esses pontos agora.',
  },
  {
    id: 'previsibilidade',
    title: 'Previsibilidade',
    insight: 'Suas respostas indicam se a operação está sendo gerida de forma preventiva ou reativa. Quando a visão chega tarde, parte do mês já foi perdida antes da correção acontecer.',
  },
  {
    id: 'vazamento_performance',
    title: 'Vazamento de performance',
    insight: 'Aqui buscamos entender onde o resultado escapa depois que o lead chega: follow-up, conversão, ritmo do vendedor, gestão ou falta de clareza sobre o gargalo real.',
  },
  {
    id: 'comissao_incentivo',
    title: 'Comissão e incentivo',
    insight: 'A comissão pode ser apenas pagamento no fechamento ou pode funcionar como motor de comportamento durante o mês. A diferença aparece na previsibilidade.',
  },
  {
    id: 'gestao_correcao',
    title: 'Gestão e correção',
    insight: 'Agora vamos fechar entendendo a capacidade de corrigir a rota antes do problema virar resultado ruim no fechamento.',
  },
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'segment',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Qual é o segmento da sua empresa?',
    options: ['Serviços B2B', 'Educação/cursos', 'Imobiliária', 'Energia solar', 'Saúde/clínicas', 'Consórcio/financeiro', 'Distribuição/indústria', 'Outro'],
    column: 'segment',
  },
  {
    id: 'seller_count',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Hoje, quantas pessoas atuam diretamente em vendas?',
    options: ['1 a 2', '3 a 5', '6 a 10', '11 a 20', '21+'],
    column: 'seller_count',
  },
  {
    id: 'performance_owner',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Quem acompanha a performance comercial hoje?',
    options: ['O próprio dono', 'Gerente comercial', 'Coordenador/líder de vendas', 'Cada vendedor se acompanha sozinho', 'Ninguém acompanha com frequência'],
  },
  {
    id: 'sales_channel',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Qual é o principal canal de venda hoje?',
    options: ['WhatsApp', 'Ligação', 'Presencial', 'CRM', 'Instagram/Redes sociais', 'Misto'],
    column: 'sales_channel',
  },
  {
    id: 'sales_model',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'O seu processo comercial é mais:',
    options: ['Venda simples e rápida', 'Venda consultiva', 'Venda recorrente', 'Venda de ticket alto', 'Venda B2B', 'Não sei definir'],
    column: 'sales_model',
    endsBlock: true,
  },
  {
    id: 'forecast_clarity',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Hoje você consegue saber, antes do fim do mês, se o time vai bater a meta?',
    options: ['Sim, com clareza', 'Mais ou menos', 'Só percebo perto do fechamento', 'Não tenho essa visão'],
  },
  {
    id: 'quota_attainment',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Quantos vendedores normalmente batem meta?',
    options: ['Quase todos', 'Mais da metade', 'Menos da metade', 'Poucos', 'Não tenho esse número claro'],
  },
  {
    id: 'tracking_frequency',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Com que frequência a performance do time é acompanhada?',
    options: ['Diariamente', 'Semanalmente', 'Quinzenalmente', 'Só no fim do mês', 'Quando surge problema'],
  },
  {
    id: 'forecast_difficulty',
    blockId: 'previsibilidade',
    type: 'text',
    question: 'Qual é hoje a maior dificuldade para prever o resultado comercial do mês?',
    placeholder: 'Ex.: falta de dados por vendedor, pipeline desatualizado, follow-up irregular...',
    endsBlock: true,
  },
  {
    id: 'contact_capture',
    blockId: 'previsibilidade',
    type: 'contact',
    question: 'Para salvar seu Mapa de Previsibilidade e enviar o resultado completo, qual WhatsApp podemos usar?',
    helper: 'O e-mail é opcional. O diagnóstico continua mesmo sem ele.',
  },
  {
    id: 'main_loss_area',
    blockId: 'vazamento_performance',
    type: 'button',
    question: 'Hoje, onde você acredita que sua operação mais perde resultado?',
    options: ['Falta de leads', 'Falta de follow-up', 'Baixa conversão', 'Falta de gestão', 'Vendedores sem ritmo', 'Leads esquecidos', 'Não sei identificar'],
  },
  {
    id: 'lead_followup_loss',
    blockId: 'vazamento_performance',
    type: 'button',
    question: 'Mesmo quando os leads chegam, existe perda por falta de acompanhamento até o fechamento?',
    options: ['Sim, acontece com frequência', 'Às vezes', 'Raramente', 'Não sei medir', 'Não acontece'],
  },
  {
    id: 'underperformance_reason',
    blockId: 'vazamento_performance',
    type: 'button',
    question: 'Quando um vendedor performa abaixo do esperado, vocês sabem rapidamente o motivo?',
    options: ['Sim, temos clareza', 'Às vezes', 'Só depois de analisar manualmente', 'Não sabemos com precisão', 'Não acompanhamos isso'],
  },
  {
    id: 'thirty_day_fix',
    blockId: 'vazamento_performance',
    type: 'text',
    question: 'Se você pudesse corrigir um problema comercial nos próximos 30 dias, qual seria?',
    placeholder: 'Ex.: follow-up, previsibilidade, comissão, rotina do gestor...',
    endsBlock: true,
  },
  {
    id: 'has_commission',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'Hoje sua empresa trabalha com comissão para vendedores?',
    options: ['Sim', 'Não', 'Parcialmente', 'Estamos estruturando'],
  },
  {
    id: 'commission_calculation',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'Como a comissão é calculada atualmente?',
    options: ['Manualmente', 'Planilha', 'Sistema interno', 'CRM/ERP', 'Não temos regra clara'],
  },
  {
    id: 'seller_commission_visibility',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'O vendedor consegue acompanhar durante o mês quanto está próximo de receber?',
    options: ['Sim, com clareza', 'Mais ou menos', 'Só no fechamento', 'Não consegue acompanhar', 'Não sei'],
  },
  {
    id: 'commission_conflict',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'Já houve dúvida, erro ou conflito relacionado à comissão?',
    options: ['Sim, frequentemente', 'Algumas vezes', 'Raramente', 'Nunca', 'Não sei'],
    endsBlock: true,
  },
  {
    id: 'individual_action_plan',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'Quando um vendedor não performa bem, existe algum plano de ação individual?',
    options: ['Sim, estruturado', 'Às vezes', 'Apenas conversas pontuais', 'Não existe', 'Não sei'],
  },
  {
    id: 'has_pdi',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'Existe algum tipo de PDI, treinamento ou acompanhamento individual?',
    options: ['Sim', 'Parcialmente', 'Apenas quando há problema', 'Não', 'Não sei'],
  },
  {
    id: 'manager_correction_data',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'O gestor tem dados suficientes para corrigir o time antes do mês acabar?',
    options: ['Sim, com clareza', 'Parcialmente', 'Só depois de analisar manualmente', 'Não', 'Não sei'],
  },
  {
    id: 'urgency',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'Você pretende corrigir esses problemas em quanto tempo?',
    options: ['Agora / próximos 30 dias', 'Próximos 60 dias', 'Próximos 90 dias', 'Sem previsão', 'Estou apenas pesquisando'],
    endsBlock: true,
  },
  {
    id: 'final_contact_choice',
    blockId: 'finalizacao',
    type: 'button',
    question: 'Você quer receber uma leitura personalizada desse diagnóstico no WhatsApp?',
    options: ['Sim, quero receber', 'Prefiro apenas ver o resultado aqui', 'Quero conversar com alguém da VAMO'],
    finalStep: true,
  },
];

export function getQuestion(questionId) {
  return DIAGNOSTIC_QUESTIONS.find((question) => question.id === questionId) || null;
}

export function getFirstQuestion() {
  return DIAGNOSTIC_QUESTIONS[0];
}

function normalizedAnswer(value) {
  return answerToText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function shouldAskQuestion(question, answers = {}) {
  const forecastClarity = normalizedAnswer(answers.forecast_clarity);
  const quotaAttainment = normalizedAnswer(answers.quota_attainment);
  const sellerCount = normalizedAnswer(answers.seller_count);
  const trackingFrequency = normalizedAnswer(answers.tracking_frequency);
  const hasCommission = normalizedAnswer(answers.has_commission);

  if (['commission_calculation', 'seller_commission_visibility'].includes(question.id)) {
    return hasCommission !== 'nao';
  }

  if (question.id === 'performance_owner') {
    return !sellerCount.includes('1 a 2');
  }

  if (question.id === 'quota_attainment') {
    return !(forecastClarity.includes('sim, com clareza') && (trackingFrequency.includes('diariamente') || trackingFrequency.includes('semanalmente')));
  }

  if (question.id === 'forecast_difficulty') {
    return !(forecastClarity.includes('sim, com clareza') && quotaAttainment.includes('quase todos'));
  }

  if (question.id === 'commission_conflict') {
    return hasCommission !== 'nao' && (
      normalizeAnswerForRules(answers.commission_calculation).includes('manual') ||
      normalizeAnswerForRules(answers.commission_calculation).includes('planilha') ||
      normalizeAnswerForRules(answers.seller_commission_visibility).includes('fechamento') ||
      normalizeAnswerForRules(answers.seller_commission_visibility).includes('nao')
    );
  }

  if (question.id === 'has_pdi') {
    return !sellerCount.includes('1 a 2');
  }

  return true;
}

function normalizeAnswerForRules(value) {
  return normalizedAnswer(value);
}

export function getAvailableQuestions(answers = {}) {
  return DIAGNOSTIC_QUESTIONS.filter((question) => shouldAskQuestion(question, answers));
}

export function getNextQuestion(questionId, answers = {}) {
  const index = DIAGNOSTIC_QUESTIONS.findIndex((question) => question.id === questionId);
  if (index < 0) return getFirstQuestion();
  return DIAGNOSTIC_QUESTIONS.slice(index + 1).find((question) => shouldAskQuestion(question, answers)) || null;
}

export function getBlock(blockId) {
  return DIAGNOSTIC_BLOCKS.find((block) => block.id === blockId) || null;
}

export function getProgress(questionId, answers = {}) {
  const available = getAvailableQuestions(answers);
  const actionable = available.length || DIAGNOSTIC_QUESTIONS.length;
  const index = available.findIndex((question) => question.id === questionId);
  return Math.max(0, Math.min(100, Math.round(((index < 0 ? 0 : index) / actionable) * 100)));
}

export function getCompletionProgress() {
  return 100;
}

export function toPublicQuestion(question, answers = {}) {
  if (!question) return null;
  const available = getAvailableQuestions(answers);
  const index = available.findIndex((item) => item.id === question.id);
  return {
    id: question.id,
    blockId: question.blockId,
    type: question.type,
    question: question.question,
    helper: question.helper || null,
    placeholder: question.placeholder || null,
    options: question.options || [],
    progress: getProgress(question.id, answers),
    position: index + 1,
    total: available.length,
    estimatedTime: '7 a 10 min',
  };
}

export function getAdaptiveMessage(questionId, answers = {}) {
  const normalized = normalizedAnswer(answers[questionId]);

  if (questionId === 'has_commission' && normalized === 'nao') {
    return 'Entendi. Então vou avaliar se a ausência de comissão hoje afeta previsibilidade, ritmo e incentivo do time, sem te fazer perguntas que não se aplicam ao seu cenário.';
  }

  if (questionId === 'forecast_clarity' && normalized.includes('sim, com clareza')) {
    return 'Boa. Como você já tem uma leitura clara de meta, vou evitar aprofundar demais esse ponto e procurar vazamentos mais ligados a execução, incentivo e correção.';
  }

  if (questionId === 'seller_count' && normalized.includes('1 a 2')) {
    return 'Com um time menor, vou priorizar perguntas sobre rotina, previsibilidade e clareza de processo, sem pesar demais temas típicos de estruturas comerciais maiores.';
  }

  return null;
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
