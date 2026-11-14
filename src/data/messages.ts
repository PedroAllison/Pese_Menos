export const MOTIVATION = [
  'Cada refeição registrada é um passo a mais rumo ao seu objetivo. Bora!',
  'Você não precisa ser perfeito, só constante.',
  'O corpo alcança o que a mente acredita. Hoje é dia de cuidar de você.',
  'Pequenas escolhas, grandes resultados. Beba água e siga firme!',
  'Disciplina é lembrar o que você quer. Você já começou — continue.',
  'Uma caminhada hoje vale mais que mil planos para amanhã.',
  'Progresso, não perfeição. Cada dia conta.',
  'Você é mais forte do que a vontade de desistir.',
  'Comer bem é uma forma de respeito com você mesmo.',
  'O resultado vem para quem não para. Mais um dia, mais uma vitória.',
  'Lembre-se do porquê você começou.',
  'Hoje é uma nova chance de fazer melhor que ontem.',
];

export function dailyMessage(date = new Date()) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  return MOTIVATION[dayOfYear % MOTIVATION.length];
}
