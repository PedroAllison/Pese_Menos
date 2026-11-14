import { Activity, AppState, ExerciseType, Profile } from '../store/types';
import { FOODS, Food } from '../data/foods';

export const KCAL_PER_KG = 7700; // ~7700 kcal ≈ 1 kg de gordura corporal

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentario: 1.2, leve: 1.375, moderado: 1.55, intenso: 1.725,
};

/** Taxa metabólica basal – Mifflin-St Jeor */
export function bmr(p: Profile, weight: number) {
  const base = 10 * weight + 6.25 * p.heightCm - 5 * p.age;
  return p.sex === 'M' ? base + 5 : base - 161;
}

/** Gasto diário sem contar exercícios registrados (eles são somados à parte) */
export function tdee(p: Profile, weight: number) {
  // Usa no máximo "leve" como base, já que os exercícios são registrados manualmente
  const factor = Math.min(ACTIVITY_FACTOR[p.activity], ACTIVITY_FACTOR.leve);
  return bmr(p, weight) * factor;
}

export function bmi(weight: number, heightCm: number) {
  const h = heightCm / 100;
  return weight / (h * h);
}

export function bmiLabel(v: number) {
  if (v < 18.5) return 'Abaixo do peso';
  if (v < 25) return 'Peso normal';
  if (v < 30) return 'Sobrepeso';
  if (v < 35) return 'Obesidade I';
  if (v < 40) return 'Obesidade II';
  return 'Obesidade III';
}

/** METs médios por tipo/velocidade (Compendium of Physical Activities) */
export function metFor(type: ExerciseType, speedKmh?: number) {
  const s = speedKmh ?? 0;
  switch (type) {
    case 'caminhada':
    case 'esteira':
      if (s >= 8) return 8.3; // já é corrida leve
      if (s >= 6.4) return 5.0;
      if (s >= 5.6) return 4.3;
      if (s >= 4.8) return 3.5;
      if (s >= 4) return 3.0;
      return 2.5;
    case 'corrida':
      if (s >= 12) return 11.8;
      if (s >= 10) return 10.0;
      if (s >= 8) return 8.3;
      return 7.0;
    case 'bike':
      if (s >= 25) return 10.0;
      if (s >= 20) return 8.0;
      if (s >= 16) return 6.8;
      return 5.0; // bicicleta ergométrica moderada
    default:
      return 4.0;
  }
}

export function exerciseKcal(type: ExerciseType, minutes: number, weightKg: number, speedKmh?: number) {
  return Math.round(metFor(type, speedKmh) * weightKg * (minutes / 60));
}

/** Meta diária de calorias segundo o plano */
export function planTargets(p: Profile, currentWeight: number) {
  const days = p.planMonths * 30.4;
  const toLose = Math.max(0, currentWeight - p.goalWeight);
  const maintenance = tdee(p, currentWeight);
  const requiredDeficit = (toLose * KCAL_PER_KG) / days;
  // Limite saudável: déficit máx ~1000 kcal/dia e nunca abaixo de 1200 (F) / 1500 (M)
  const minKcal = p.sex === 'M' ? 1500 : 1200;
  const maxDietDeficit = Math.max(0, Math.min(maintenance - minKcal, 750));
  const dietDeficit = Math.min(requiredDeficit, maxDietDeficit);
  const exerciseDeficit = Math.max(0, requiredDeficit - dietDeficit);
  const targetKcal = Math.round(maintenance - dietDeficit);
  const weeklyLoss = (requiredDeficit * 7) / KCAL_PER_KG;
  const walkMinutes = Math.ceil(exerciseDeficit / ((metFor('caminhada', 5.6) * currentWeight) / 60));
  return {
    maintenance: Math.round(maintenance),
    targetKcal,
    requiredDeficit: Math.round(requiredDeficit),
    exerciseKcalPerDay: Math.round(exerciseDeficit),
    walkMinutesPerDay: walkMinutes,
    weeklyLoss,
    healthy: weeklyLoss <= 1.0,
    proteinG: Math.round(currentWeight * 1.6),
    waterMl: Math.round(currentWeight * 35),
  };
}

/** Projeção de marcos 3-6-9-12 meses com o ritmo atual do plano */
export function milestones(p: Profile, currentWeight: number) {
  const t = planTargets(p, currentWeight);
  const start = new Date(p.startDate);
  return [3, 6, 9, 12].map(m => {
    const date = new Date(start); date.setMonth(date.getMonth() + m);
    const daysFromStart = m * 30.4;
    const expected = Math.max(p.goalWeight, p.startWeight - (t.requiredDeficit * daysFromStart) / KCAL_PER_KG);
    return { months: m, date, expected: +expected.toFixed(1) };
  });
}

export function dayTotals(state: AppState, day: string) {
  const meals = state.meals.filter(m => m.date === day);
  const food = meals.flatMap(m => m.items);
  const drinks = state.drinks.filter(d => d.date === day);
  const ex = state.exercises.filter(e => e.date === day);
  const kcalIn = food.reduce((s, i) => s + i.kcal, 0) + drinks.reduce((s, d) => s + d.kcal, 0);
  return {
    kcalIn: Math.round(kcalIn),
    protein: Math.round(food.reduce((s, i) => s + i.protein, 0)),
    carbs: Math.round(food.reduce((s, i) => s + i.carbs, 0)),
    fat: Math.round(food.reduce((s, i) => s + i.fat, 0)),
    waterMl: Math.round(drinks.reduce((s, d) => s + d.ml, 0)),
    kcalExercise: ex.reduce((s, e) => s + e.kcal, 0),
    mealsLogged: new Set(meals.map(m => m.type)),
  };
}

/**
 * Peso estimado: parte da última pesagem e soma o balanço calórico
 * (consumido − gasto basal − exercício) de cada dia COM registro desde então.
 * Dias sem nenhum registro de comida são ignorados para não distorcer a conta.
 */
export function estimatedWeight(state: AppState) {
  const p = state.profile;
  if (!p) return 0;
  const sorted = [...state.weighIns].sort((a, b) => a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1] ?? { date: p.startDate.slice(0, 10), weight: p.startWeight };
  let weight = last.weight;
  const today = todayKey();
  const d = new Date(last.date + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  const days: string[] = [];
  while (todayKey(d) <= today) { days.push(todayKey(d)); d.setDate(d.getDate() + 1); }
  for (const day of days) {
    const t = dayTotals(state, day);
    if (t.kcalIn === 0) continue;
    const isToday = day === today;
    // para hoje, considera o gasto basal proporcional à hora do dia
    const frac = isToday ? Math.min(1, (new Date().getHours() + new Date().getMinutes() / 60) / 24) : 1;
    const balance = t.kcalIn - tdee(p, weight) * frac - t.kcalExercise;
    weight += balance / KCAL_PER_KG;
  }
  return +weight.toFixed(2);
}

/** Alimentos a evitar e sugeridos, filtrando alergias e preferências */
export function foodAdvice(p: Profile) {
  const allowed = (f: Food) => !(f.tags ?? []).some(t => p.allergies.includes(t)) && !p.dislikes.includes(f.id);
  const avoid = FOODS.filter(f => allowed(f) && ((f.tags ?? []).some(t => ['fritura', 'acucar', 'ultraprocessado'].includes(t)) || f.kcal > 400));
  const good = FOODS.filter(f => allowed(f) && !avoid.includes(f));
  const score = (f: Food) => (p.likes.includes(f.id) ? 100 : 0) + f.protein * 2 - f.kcal / 20;
  const pick = (cat: string, n: number) => good.filter(f => f.category === cat).sort((a, b) => score(b) - score(a)).slice(0, n);
  return {
    avoid,
    proteins: pick('proteina', 6),
    carbs: pick('carboidrato', 5),
    salads: pick('salada', 6),
    fruits: pick('fruta', 5),
    dairy: pick('laticinio', 3),
    blockedByAllergy: FOODS.filter(f => (f.tags ?? []).some(t => p.allergies.includes(t))),
  };
}

/** Monta um cardápio diário personalizado dentro da meta calórica */
export function buildDiet(p: Profile, targetKcal: number) {
  const a = foodAdvice(p);
  const first = <T,>(arr: T[], i = 0) => arr[i % Math.max(arr.length, 1)];
  const dist = { cafe: 0.25, almoco: 0.35, cafe_tarde: 0.12, janta: 0.22, ceia: 0.06 };
  const portion = (f: Food | undefined, kcal: number) => (f ? { food: f, grams: Math.max(20, Math.round((kcal / f.kcal) * 100 / 5) * 5) } : null);
  const plan = [
    { meal: 'Café da manhã', items: [portion(first(a.carbs, 2) ?? first(a.fruits), targetKcal * dist.cafe * 0.5), portion(first(a.dairy) ?? first(a.proteins), targetKcal * dist.cafe * 0.3), portion(first(a.fruits), targetKcal * dist.cafe * 0.2)] },
    { meal: 'Almoço', items: [portion(first(a.proteins), targetKcal * dist.almoco * 0.4), portion(first(a.carbs), targetKcal * dist.almoco * 0.35), portion(first(a.carbs, 1), targetKcal * dist.almoco * 0.15), portion(first(a.salads), targetKcal * dist.almoco * 0.1)] },
    { meal: 'Café da tarde', items: [portion(first(a.fruits, 1), targetKcal * dist.cafe_tarde * 0.5), portion(first(a.dairy, 1) ?? first(a.proteins, 2), targetKcal * dist.cafe_tarde * 0.5)] },
    { meal: 'Jantar', items: [portion(first(a.proteins, 1), targetKcal * dist.janta * 0.5), portion(first(a.carbs, 3), targetKcal * dist.janta * 0.3), portion(first(a.salads, 1), targetKcal * dist.janta * 0.2)] },
    { meal: 'Ceia', items: [portion(first(a.fruits, 2), targetKcal * dist.ceia)] },
  ];
  return plan.map(m => ({ meal: m.meal, items: m.items.filter(Boolean) as { food: Food; grams: number }[] }));
}
