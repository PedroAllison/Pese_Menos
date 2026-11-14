import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DrinkLog, ExerciseLog, Meal, Profile, Settings } from './types';
import { todayKey } from '../logic/calc';
import { rescheduleAll } from '../logic/notifications';

const KEY = '@pese_menos_state_v1';

export const defaultSettings: Settings = {
  alarms: [
    { meal: 'cafe', enabled: true, hour: 9, minute: 0 },
    { meal: 'lanche_manha', enabled: false, hour: 10, minute: 30 },
    { meal: 'almoco', enabled: true, hour: 13, minute: 30 },
    { meal: 'cafe_tarde', enabled: true, hour: 16, minute: 30 },
    { meal: 'janta', enabled: true, hour: 20, minute: 30 },
    { meal: 'ceia', enabled: false, hour: 22, minute: 30 },
  ],
  morningMessage: { enabled: true, hour: 7, minute: 0 },
  waterGoalMl: 2500,
  waterReminder: true,
};

const initial: AppState = { profile: null, meals: [], drinks: [], exercises: [], weighIns: [], settings: defaultSettings };

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

interface Ctx {
  state: AppState;
  loaded: boolean;
  saveProfile: (p: Profile) => void;
  addMeal: (m: Omit<Meal, 'id'>) => void;
  removeMeal: (id: string) => void;
  addDrink: (d: Omit<DrinkLog, 'id' | 'date' | 'time'>) => void;
  removeDrink: (id: string) => void;
  addExercise: (e: Omit<ExerciseLog, 'id' | 'date'>) => void;
  removeExercise: (id: string) => void;
  addWeighIn: (weight: number) => void;
  saveSettings: (s: Settings) => void;
  resetAll: () => void;
}

const AppCtx = createContext<Ctx>(null as any);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initial);
  const [loaded, setLoaded] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(raw => {
      if (raw) {
        const s = JSON.parse(raw) as AppState;
        setState({ ...initial, ...s, settings: { ...defaultSettings, ...s.settings } });
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state));
    if (first.current) { first.current = false; }
    rescheduleAll(state).catch(() => {});
  }, [state, loaded]);

  const update = (fn: (s: AppState) => AppState) => setState(s => fn(s));

  const value: Ctx = {
    state, loaded,
    saveProfile: p => update(s => ({
      ...s, profile: p,
      weighIns: s.weighIns.length ? s.weighIns : [{ date: p.startDate.slice(0, 10), weight: p.startWeight }],
    })),
    addMeal: m => update(s => ({ ...s, meals: [...s.meals, { ...m, id: uid() }] })),
    removeMeal: id => update(s => ({ ...s, meals: s.meals.filter(m => m.id !== id) })),
    addDrink: d => update(s => ({
      ...s, drinks: [...s.drinks, { ...d, id: uid(), date: todayKey(), time: new Date().toTimeString().slice(0, 5) }],
    })),
    removeDrink: id => update(s => ({ ...s, drinks: s.drinks.filter(d => d.id !== id) })),
    addExercise: e => update(s => ({ ...s, exercises: [...s.exercises, { ...e, id: uid(), date: todayKey() }] })),
    removeExercise: id => update(s => ({ ...s, exercises: s.exercises.filter(e => e.id !== id) })),
    addWeighIn: weight => update(s => ({
      ...s, weighIns: [...s.weighIns.filter(w => w.date !== todayKey()), { date: todayKey(), weight }],
    })),
    saveSettings: settings => update(s => ({ ...s, settings })),
    resetAll: () => setState(initial),
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
