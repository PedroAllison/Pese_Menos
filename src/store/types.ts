export type Sex = 'M' | 'F';
export type Activity = 'sedentario' | 'leve' | 'moderado' | 'intenso';
export type MealType = 'cafe' | 'lanche_manha' | 'almoco' | 'cafe_tarde' | 'janta' | 'ceia';

export const MEAL_LABELS: Record<MealType, string> = {
  cafe: 'Café da manhã',
  lanche_manha: 'Lanche da manhã',
  almoco: 'Almoço',
  cafe_tarde: 'Café da tarde',
  janta: 'Jantar',
  ceia: 'Ceia',
};

export interface Profile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  startWeight: number;
  goalWeight: number;
  activity: Activity;
  planMonths: 3 | 6 | 9 | 12;
  startDate: string; // ISO
  allergies: string[];
  likes: string[]; // ids de alimentos
  dislikes: string[];
}

export interface MealItem {
  foodId: string;
  name: string;
  measureId: string;
  quantity: number; // nº de medidas
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal { id: string; date: string; type: MealType; items: MealItem[]; note?: string; }

export interface DrinkLog { id: string; date: string; drinkId: string; name: string; ml: number; kcal: number; time: string; }

export type ExerciseType = 'caminhada' | 'corrida' | 'esteira' | 'bike' | 'outro';
export interface ExerciseLog {
  id: string; date: string; type: ExerciseType; minutes: number;
  speedKmh?: number; distanceKm?: number; kcal: number; manualKcal: boolean;
}

export interface WeighIn { date: string; weight: number; }

export interface Alarm { meal: MealType; enabled: boolean; hour: number; minute: number; }

export interface Settings {
  alarms: Alarm[];
  morningMessage: { enabled: boolean; hour: number; minute: number };
  waterGoalMl: number;
  waterReminder: boolean;
}

export interface AppState {
  profile: Profile | null;
  meals: Meal[];
  drinks: DrinkLog[];
  exercises: ExerciseLog[];
  weighIns: WeighIn[];
  settings: Settings;
}
