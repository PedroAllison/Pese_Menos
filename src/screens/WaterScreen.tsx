import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text } from 'react-native';
import { useApp } from '../store/AppContext';
import { DRINKS } from '../data/foods';
import { Btn, C, Card, Chips, Field, num, Progress, Row, s, Sub, Title } from '../components/ui';
import { dayTotals, todayKey } from '../logic/calc';

export default function WaterScreen() {
  const { state, addDrink, removeDrink } = useApp();
  const [drinkId, setDrinkId] = useState('agua');
  const [ml, setMl] = useState('200');
  const t = dayTotals(state, todayKey());
  const goal = state.settings.waterGoalMl;
  const logs = state.drinks.filter(d => d.date === todayKey());

  const add = (amount: number) => {
    const d = DRINKS.find(x => x.id === drinkId)!;
    addDrink({ drinkId, name: d.name, ml: amount, kcal: Math.round((d.kcalPer100ml * amount) / 100) });
    if ((d.tags ?? []).includes('acucar')) Alert.alert('Dica', 'Bebidas açucaradas somam calorias rápido. Prefira água, chá ou versões zero.');
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Card>
        <Title>💧 Hidratação</Title>
        <Text style={s.big}>{(t.waterMl / 1000).toFixed(2)} L</Text>
        <Sub>Meta: {(goal / 1000).toFixed(1)} L</Sub>
        <Progress value={t.waterMl / goal} color={C.blue} />
      </Card>
      <Card>
        <Title>Registrar bebida</Title>
        <Chips options={DRINKS.map(d => ({ id: d.id, label: d.name }))} value={drinkId} onChange={setDrinkId} />
        <Row style={{ gap: 6, marginBottom: 8 }}>
          {[200, 300, 500].map(v => <Btn key={v} small variant="outline" title={`${v} ml`} onPress={() => add(v)} />)}
        </Row>
        <Field label="Outra quantidade (ml)" keyboardType="numeric" value={ml} onChangeText={setMl} />
        <Btn title="Adicionar" onPress={() => num(ml) > 0 && add(num(ml))} />
      </Card>
      <Card>
        <Title>Hoje</Title>
        {logs.length === 0 && <Sub>Nada registrado ainda.</Sub>}
        {logs.map(l => (
          <Pressable key={l.id} onLongPress={() => removeDrink(l.id)} style={s.item}>
            <Row><Text>{l.time} · {l.name}</Text><Sub>{l.ml} ml · {l.kcal} kcal</Sub></Row>
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}
