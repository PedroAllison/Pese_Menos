import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AppState, MEAL_LABELS } from '../store/types';
import { MOTIVATION } from '../data/messages';
import { dayTotals, estimatedWeight, todayKey } from './calc';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

export async function requestPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Lembretes', importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const r = await Notifications.requestPermissionsAsync();
  return r.status === 'granted';
}

let running = false;
/**
 * Agenda os próximos 7 dias de lembretes.
 * Lembretes de refeição: só são agendados se a refeição ainda NÃO foi registrada naquele dia,
 * então ao registrar o almoço, o lembrete de hoje some automaticamente.
 */
export async function rescheduleAll(state: AppState) {
  if (running || !state.profile) return;
  running = true;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const now = new Date();
    const p = state.profile;
    const est = estimatedWeight(state);
    const remaining = Math.max(0, est - p.goalWeight).toFixed(1);

    for (let d = 0; d < 7; d++) {
      const day = new Date(now); day.setDate(now.getDate() + d);
      const key = todayKey(day);
      const totals = dayTotals(state, key);

      for (const a of state.settings.alarms) {
        if (!a.enabled || totals.mealsLogged.has(a.meal)) continue;
        // lembrete ~10 minutos depois do horário da refeição
        const when = new Date(day); when.setHours(a.hour, a.minute + 10, 0, 0);
        if (when <= now) continue;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Já registrou o ${MEAL_LABELS[a.meal].toLowerCase()}?`,
            body: 'Toque para anotar o que você comeu. Uma média já ajuda!',
            data: { screen: 'Refeições', meal: a.meal },
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
        });
      }

      const m = state.settings.morningMessage;
      if (m.enabled) {
        const when = new Date(day); when.setHours(m.hour, m.minute, 0, 0);
        if (when > now) {
          const idx = (day.getDate() + day.getMonth() * 31) % MOTIVATION.length;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Bom dia, ${p.name.split(' ')[0]}! 💪`,
              body: `${MOTIVATION[idx]} Faltam ~${remaining} kg para sua meta.`,
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
          });
        }
      }

      if (state.settings.waterReminder) {
        for (const h of [11, 15, 18]) {
          const when = new Date(day); when.setHours(h, 0, 0, 0);
          if (when <= now) continue;
          if (d === 0 && totals.waterMl >= state.settings.waterGoalMl) continue;
          await Notifications.scheduleNotificationAsync({
            content: { title: 'Hora de beber água 💧', body: 'Registre seu copo no app.' },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
          });
        }
      }
    }
  } finally {
    running = false;
  }
}
