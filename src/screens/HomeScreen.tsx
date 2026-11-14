import React, { useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { useApp } from '../store/AppContext';
import { bmi, bmiLabel, dayTotals, estimatedWeight, planTargets, todayKey } from '../logic/calc';
import { dailyMessage } from '../data/messages';
import { Btn, C, Card, Field, num, Progress, Row, s, Sub, Title } from '../components/ui';
import { MEAL_LABELS } from '../store/types';

export default function HomeScreen() {
  const { state, addWeighIn } = useApp();
  const p = state.profile!;
  const [open, setOpen] = useState(false);
  const [w, setW] = useState('');

  const est = estimatedWeight(state);
  const t = planTargets(p, est);
  const today = dayTotals(state, todayKey());
  const lost = p.startWeight - est;
  const total = p.startWeight - p.goalWeight;
  const remaining = Math.max(0, est - p.goalWeight);
  const balance = today.kcalIn - t.targetKcal - today.kcalExercise;
  const lastWeigh = [...state.weighIns].sort((a, b) => b.date.localeCompare(a.date))[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const pending = state.settings.alarms.filter(a => a.enabled && !today.mealsLogged.has(a.meal) && (a.hour < hour));

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Card style={{ backgroundColor: C.primary }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{greet}, {p.name.split(' ')[0]}!</Text>
        <Text style={{ color: '#ecfdf5', marginTop: 4 }}>{dailyMessage()}</Text>
      </Card>

      <Card>
        <Sub>Peso atual (estimado pelo app)</Sub>
        <Row>
          <Text style={s.big}>{est.toFixed(1)} <Text style={{ fontSize: 20 }}>kg</Text></Text>
          <Btn small title="Me pesei" onPress={() => { setW(est.toFixed(1)); setOpen(true); }} />
        </Row>
        <Sub>Última pesagem: {lastWeigh?.weight.toFixed(1)} kg em {lastWeigh?.date.split('-').reverse().join('/')}</Sub>
        <View style={{ marginTop: 10 }}>
          <Row><Sub>Início {p.startWeight} kg</Sub><Sub>Meta {p.goalWeight} kg</Sub></Row>
          <Progress value={total > 0 ? lost / total : 0} />
          <Row>
            <Text style={{ color: C.primaryDark, fontWeight: '700' }}>{lost >= 0 ? `−${lost.toFixed(1)}` : `+${(-lost).toFixed(1)}`} kg</Text>
            <Text style={{ color: C.text, fontWeight: '700' }}>Faltam {remaining.toFixed(1)} kg</Text>
          </Row>
        </View>
        <Sub style={{ marginTop: 6 }}>IMC {bmi(est, p.heightCm).toFixed(1)} · {bmiLabel(bmi(est, p.heightCm))}</Sub>
      </Card>

      <Card>
        <Title>Hoje</Title>
        <Row><Sub>Consumido</Sub><Text style={{ fontWeight: '700' }}>{today.kcalIn} / {t.targetKcal} kcal</Text></Row>
        <Progress value={today.kcalIn / t.targetKcal} color={today.kcalIn > t.targetKcal ? C.danger : C.primary} />
        <Row><Sub>Exercícios</Sub><Text style={{ fontWeight: '700' }}>−{today.kcalExercise} / {t.exerciseKcalPerDay} kcal</Text></Row>
        <Progress value={t.exerciseKcalPerDay ? today.kcalExercise / t.exerciseKcalPerDay : 1} color={C.warn} />
        <Row><Sub>Água</Sub><Text style={{ fontWeight: '700' }}>{(today.waterMl / 1000).toFixed(2)} / {(state.settings.waterGoalMl / 1000).toFixed(1)} L</Text></Row>
        <Progress value={today.waterMl / state.settings.waterGoalMl} color={C.blue} />
        <Row style={{ marginTop: 8 }}>
          <Sub>Proteína {today.protein}g / {t.proteinG}g</Sub>
          <Sub>Carb {today.carbs}g · Gord {today.fat}g</Sub>
        </Row>
        <Text style={{ marginTop: 10, fontWeight: '600', color: balance > 0 ? C.danger : C.primaryDark }}>
          {balance > 0 ? `Você passou ${balance} kcal da meta. Uma caminhada de ~${Math.ceil(balance / (3.5 * est / 60))} min compensa!` : `Ainda pode consumir ${-balance} kcal hoje.`}
        </Text>
      </Card>

      {pending.length > 0 && (
        <Card style={{ borderLeftWidth: 4, borderLeftColor: C.warn }}>
          <Title>Refeições não registradas</Title>
          {pending.map(a => <Sub key={a.meal}>• {MEAL_LABELS[a.meal]}</Sub>)}
        </Card>
      )}

      <Modal visible={open} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: '#0007', justifyContent: 'center', padding: 24 }}>
          <Card>
            <Title>Registrar pesagem</Title>
            <Sub style={{ marginBottom: 8 }}>O app recalcula tudo a partir do peso real da balança.</Sub>
            <Field label="Peso (kg)" keyboardType="decimal-pad" value={w} onChangeText={setW} autoFocus />
            <Btn title="Salvar" onPress={() => { if (num(w) > 0) addWeighIn(num(w)); setOpen(false); }} />
            <Btn title="Cancelar" variant="outline" onPress={() => setOpen(false)} />
          </Card>
        </View>
      </Modal>
    </ScrollView>
  );
}
