export const DIAGNOSTIC_BLOCKS = [
  {
    id: 'contexto_comercial',
    title: 'Contexto comercial',
    insight: 'Com esse contexto inicial, normalmente os principais riscos aparecem em acompanhamento de meta, clareza de comissao e capacidade de corrigir o time antes do mes fechar. Vou investigar esses pontos agora.',
  },
  {
    id: 'previsibilidade',
    title: 'Previsibilidade',
    insight: 'Suas respostas indicam se a operacao esta sendo gerida de forma preventiva ou reativa. Quando a visao chega tarde, parte do mes ja foi perdida antes da correcao acontecer.',
  },
  {
    id: 'vazamento_performance',
    title: 'Vazamento de performance',
    insight: 'Aqui buscamos entender onde o resultado escapa depois que o lead chega: follow-up, conversao, ritmo do vendedor, gestao ou falta de clareza sobre o gargalo real.',
  },
  {
    id: 'comissao_incentivo',
    title: 'Comissao e incentivo',
    insight: 'A comissao pode ser apenas pagamento no fechamento ou pode funcionar como motor de comportamento durante o mes. A diferenca aparece na previsibilidade.',
  },
  {
    id: 'gestao_correcao',
    title: 'Gestao e correcao',
    insight: 'Agora vamos fechar entendendo a capacidade de corrigir a rota antes do problema virar resultado ruim no fechamento.',
  },
];

export const DIAGNOSTIC_QUESTIONS = [
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
    options: ['O proprio dono', 'Gerente comercial', 'Coordenador/lider de vendas', 'Cada vendedor se acompanha sozinho', 'Ninguem acompanha com frequencia'],
  },
  {
    id: 'sales_channel',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'Qual e o principal canal de venda hoje?',
    options: ['WhatsApp', 'Ligacao', 'Presencial', 'CRM', 'Instagram/Redes sociais', 'Misto'],
    column: 'sales_channel',
  },
  {
    id: 'sales_model',
    blockId: 'contexto_comercial',
    type: 'button',
    question: 'O seu processo comercial e mais:',
    options: ['Venda simples e rapida', 'Venda consultiva', 'Venda recorrente', 'Venda de ticket alto', 'Venda B2B', 'Nao sei definir'],
    column: 'sales_model',
    endsBlock: true,
  },
  {
    id: 'forecast_clarity',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Hoje voce consegue saber, antes do fim do mes, se o time vai bater a meta?',
    options: ['Sim, com clareza', 'Mais ou menos', 'So percebo perto do fechamento', 'Nao tenho essa visao'],
  },
  {
    id: 'quota_attainment',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Quantos vendedores normalmente batem meta?',
    options: ['Quase todos', 'Mais da metade', 'Menos da metade', 'Poucos', 'Nao tenho esse numero claro'],
  },
  {
    id: 'tracking_frequency',
    blockId: 'previsibilidade',
    type: 'button',
    question: 'Com que frequencia a performance do time e acompanhada?',
    options: ['Diariamente', 'Semanalmente', 'Quinzenalmente', 'So no fim do mes', 'Quando surge problema'],
  },
  {
    id: 'forecast_difficulty',
    blockId: 'previsibilidade',
    type: 'text',
    question: 'Qual e hoje a maior dificuldade para prever o resultado comercial do mes?',
    placeholder: 'Ex.: falta de dados por vendedor, pipeline desatualizado, follow-up irregular...',
    endsBlock: true,
  },
  {
    id: 'contact_capture',
    blockId: 'previsibilidade',
    type: 'contact',
    question: 'Para salvar seu Raio-X e enviar o resultado completo, qual WhatsApp podemos usar?',
    helper: 'O e-mail e opcional. O diagnostico continua mesmo sem ele.',
  },
  {
    id: 'main_loss_area',
    blockId: 'vazamento_performance',
    type: 'button',
    question: 'Hoje, onde voce acredita que sua operacao mais perde resultado?',
    options: ['Falta de leads', 'Falta de follow-up', 'Baixa conversao', 'Falta de gestao', 'Vendedores sem ritmo', 'Leads esquecidos', 'Nao sei identificar'],
  },
  {
    id: 'lead_followup_loss',
    blockId: 'vazamento_performance',
    type: 'button',
    question: 'Existem leads que deixam de ser respondidos ou acompanhados corretamente?',
    options: ['Sim, acontece com frequencia', 'As vezes', 'Raramente', 'Nao sei medir', 'Nao acontece'],
  },
  {
    id: 'underperformance_reason',
    blockId: 'vazamento_performance',
    type: 'button',
    question: 'Quando um vendedor performa abaixo do esperado, voces sabem rapidamente o motivo?',
    options: ['Sim, temos clareza', 'As vezes', 'So depois de analisar manualmente', 'Nao sabemos com precisao', 'Nao acompanhamos isso'],
  },
  {
    id: 'thirty_day_fix',
    blockId: 'vazamento_performance',
    type: 'text',
    question: 'Se voce pudesse corrigir um problema comercial nos proximos 30 dias, qual seria?',
    placeholder: 'Ex.: follow-up, previsibilidade, comissao, rotina do gestor...',
    endsBlock: true,
  },
  {
    id: 'has_commission',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'Hoje sua empresa trabalha com comissao para vendedores?',
    options: ['Sim', 'Nao', 'Parcialmente', 'Estamos estruturando'],
  },
  {
    id: 'commission_calculation',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'Como a comissao e calculada atualmente?',
    options: ['Manualmente', 'Planilha', 'Sistema interno', 'CRM/ERP', 'Nao temos regra clara'],
  },
  {
    id: 'seller_commission_visibility',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'O vendedor consegue acompanhar durante o mes quanto esta proximo de receber?',
    options: ['Sim, com clareza', 'Mais ou menos', 'So no fechamento', 'Nao consegue acompanhar', 'Nao sei'],
  },
  {
    id: 'commission_conflict',
    blockId: 'comissao_incentivo',
    type: 'button',
    question: 'Ja houve duvida, erro ou conflito relacionado a comissao?',
    options: ['Sim, frequentemente', 'Algumas vezes', 'Raramente', 'Nunca', 'Nao sei'],
    endsBlock: true,
  },
  {
    id: 'individual_action_plan',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'Quando um vendedor nao performa bem, existe algum plano de acao individual?',
    options: ['Sim, estruturado', 'As vezes', 'Apenas conversas pontuais', 'Nao existe', 'Nao sei'],
  },
  {
    id: 'has_pdi',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'Existe algum tipo de PDI, treinamento ou acompanhamento individual?',
    options: ['Sim', 'Parcialmente', 'Apenas quando ha problema', 'Nao', 'Nao sei'],
  },
  {
    id: 'manager_correction_data',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'O gestor tem dados suficientes para corrigir o time antes do mes acabar?',
    options: ['Sim, com clareza', 'Parcialmente', 'So depois de analisar manualmente', 'Nao', 'Nao sei'],
  },
  {
    id: 'urgency',
    blockId: 'gestao_correcao',
    type: 'button',
    question: 'Voce pretende corrigir esses problemas em quanto tempo?',
    options: ['Agora / proximos 30 dias', 'Proximos 60 dias', 'Proximos 90 dias', 'Sem previsao', 'Estou apenas pesquisando'],
    endsBlock: true,
  },
  {
    id: 'final_contact_choice',
    blockId: 'finalizacao',
    type: 'button',
    question: 'Voce quer receber uma leitura personalizada desse diagnostico no WhatsApp?',
    options: ['Sim, quero receber', 'Prefiro apenas ver o resultado aqui', 'Quero conversar com alguem da VAMO'],
    finalStep: true,
  },
];

export function getQuestion(questionId) {
  return DIAGNOSTIC_QUESTIONS.find((question) => question.id === questionId) || null;
}

export function getFirstQuestion() {
  return DIAGNOSTIC_QUESTIONS[0];
}

export function getNextQuestion(questionId) {
  const index = DIAGNOSTIC_QUESTIONS.findIndex((question) => question.id === questionId);
  if (index < 0) return getFirstQuestion();
  return DIAGNOSTIC_QUESTIONS[index + 1] || null;
}

export function getBlock(blockId) {
  return DIAGNOSTIC_BLOCKS.find((block) => block.id === blockId) || null;
}

export function getProgress(questionId) {
  const actionable = DIAGNOSTIC_QUESTIONS.length;
  const index = DIAGNOSTIC_QUESTIONS.findIndex((question) => question.id === questionId);
  return Math.max(0, Math.min(100, Math.round(((index < 0 ? 0 : index) / actionable) * 100)));
}

export function getCompletionProgress() {
  return 100;
}

export function toPublicQuestion(question) {
  if (!question) return null;
  const index = DIAGNOSTIC_QUESTIONS.findIndex((item) => item.id === question.id);
  return {
    id: question.id,
    blockId: question.blockId,
    type: question.type,
    question: question.question,
    helper: question.helper || null,
    placeholder: question.placeholder || null,
    options: question.options || [],
    progress: getProgress(question.id),
    position: index + 1,
    total: DIAGNOSTIC_QUESTIONS.length,
    estimatedTime: '7 a 10 min',
  };
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
