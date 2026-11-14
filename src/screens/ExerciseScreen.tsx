import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text } from 'react-native';
import { useApp } from '../store/AppContext';
import { ExerciseType } from '../store/types';
import { Btn, Card, Chips, Field, num, Row, s, Sub, Title } from '../components/ui';
import { dayTotals, estimatedWeight, exerciseKcal, planTargets, todayKey } from '../logic/calc';

const TYPES: { id: ExerciseType; label: string }[] = [
  { id: 'caminhada', label: '🚶 Caminhada' }, { id: 'corrida', label: '🏃 Corrida' },
  { id: 'esteira', label: '🏋️ Esteira' }, { id: 'bike', label: '🚴 Bicicleta' }, { id: 'outro', label: 'Outro' },
];
const SPEEDS: Record<ExerciseType, { id: number; label: string }[]> = {
  caminhada: [{ id: 4, label: 'Devagar (4 km/h)' }, { id: 5, label: 'Normal (5 km/h)' }, { id: 6, label: 'Rápida (6 km/h)' }],
  esteira: [{ id: 4.5, label: '4,5 km/h' }, { id: 5.5, label: '5,5 km/h' }, { id: 6.5, label: '6,5 km/h' }, { id: 8, label: '8 km/h' }],
  corrida: [{ id: 8, label: 'Trote (8)' }, { id: 10, label: 'Moderada (10)' }, { id: 12, label: 'Forte (12)' }],
  bike: [{ id: 14, label: 'Leve' }, { id: 18, label: 'Moderada' }, { id: 22, label: 'Forte' }],
  outro: [],
};

export default function ExerciseScreen() {
  const { state, addExercise, removeExercise } = useApp();
  const weight = estimatedWeight(state);
  const t = planTargets(state.profile!, weight);
  const [type, setType] = useState<ExerciseType>('caminhada');
  const [minutes, setMinutes] = useState('30');
  const [speed, setSpeed] = useState<number>(5);
  const [distance, setDistance] = useState('');
  const [manual, setManual] = useState('');

  // se informou distância, calcula velocidade média
  const effSpeed = num(distance) > 0 && num(minutes) > 0 ? num(distance) / (num(minutes) / 60) : speed;
  const estimate = exerciseKcal(type, num(minutes), weight, effSpeed);
  const isGym = type === 'esteira' || type === 'bike';

  const save = () => {
    if (!num(minutes)) return Alert.alert('Informe o tempo.');
    const kcal = num(manual) > 0 ? Math.round(num(manual)) : estimate;
    addExercise({ type, minutes: num(minutes), speedKmh: +effSpeed.toFixed(1), distanceKm: num(distance) || undefined, kcal, manualKcal: num(manual) > 0 });
    setManual(''); setDistance('');
    Alert.alert('Exercício registrado 🔥', `−${kcal} kcal`);
  };

  const today = dayTotals(state, todayKey());
  const logs = state.exercises.filter(e => e.date === todayKey());

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Card>
        <Title>Meta de hoje</Title>
        <Sub>Queimar ~{t.exerciseKcalPerDay} kcal em atividade (≈ {t.walkMinutesPerDay} min de caminhada rápida).</Sub>
        <Text style={{ fontWeight: '700', marginTop: 6 }}>Feito: {today.kcalExercise} kcal</Text>
      </Card>
      <Card>
        <Title>Registrar exercício</Title>
        <Chips options={TYPES} value={type} onChange={(v: ExerciseType) => { setType(v); setSpeed(SPEEDS[v][1]?.id ?? SPEEDS[v][0]?.id ?? 0); }} />
        <Field label="Tempo (minutos)" keyboardType="numeric" value={minutes} onChangeText={setMinutes} />
        {SPEEDS[type].length > 0 && (<><Sub>Velocidade aproximada</Sub><Chips options={SPEEDS[type]} value={speed} onChange={setSpeed} /></>)}
        {type !== 'outro' && <Field label="Distância (km) – opcional" keyboardType="decimal-pad" value={distance} onChangeText={setDistance} />}
        <Field label={isGym ? 'Calorias que o aparelho mostrou (opcional)' : 'Calorias do relógio/app (opcional)'} keyboardType="numeric" value={manual} onChangeText={setManual} />
        <Sub>Estimativa do app: ~{estimate} kcal {num(manual) > 0 ? '(será usado o valor informado)' : ''}</Sub>
        <Btn title="Salvar exercício" onPress={save} />
      </Card>
      <Card>
        <Title>Hoje</Title>
        {logs.length === 0 && <Sub>Nenhum exercício ainda.</Sub>}
        {logs.map(l => (
          <Pressable key={l.id} onLongPress={() => removeExercise(l.id)} style={s.item}>
            <Row><Text>{TYPES.find(x => x.id === l.type)?.label} · {l.minutes} min</Text><Text style={{ fontWeight: '700' }}>−{l.kcal} kcal</Text></Row>
            <Sub>{l.speedKmh ? `${l.speedKmh} km/h` : ''}{l.distanceKm ? ` · ${l.distanceKm} km` : ''}</Sub>
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}
