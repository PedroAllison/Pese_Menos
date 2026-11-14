import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../store/AppContext';
import { buildDiet, estimatedWeight, foodAdvice, milestones, planTargets } from '../logic/calc';
import { C, Card, Row, s, Sub, Title } from '../components/ui';

const clean = (n: string) => n.replace(/\s*\(.*\)/, '');

export default function PlanScreen() {
  const { state } = useApp();
  const p = state.profile!;
  const est = estimatedWeight(state);
  const t = planTargets(p, est);
  const ms = milestones(p, est);
  const advice = foodAdvice(p);
  const diet = buildDiet(p, t.targetKcal);
  const sorted = [...state.weighIns].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Card>
        <Title>Seu plano de {p.planMonths === 12 ? '1 ano' : `${p.planMonths} meses`}</Title>
        <Row><Sub>Gasto de manutenção</Sub><Text>{t.maintenance} kcal/dia</Text></Row>
        <Row><Sub>Meta de consumo</Sub><Text style={{ fontWeight: '700' }}>{t.targetKcal} kcal/dia</Text></Row>
        <Row><Sub>Queimar com exercício</Sub><Text>{t.exerciseKcalPerDay} kcal/dia</Text></Row>
        <Row><Sub>Caminhada sugerida</Sub><Text>{t.walkMinutesPerDay} min/dia</Text></Row>
        <Row><Sub>Proteína</Sub><Text>{t.proteinG} g/dia</Text></Row>
        <Row><Sub>Água sugerida</Sub><Text>{(t.waterMl / 1000).toFixed(1)} L/dia</Text></Row>
        <Row><Sub>Ritmo</Sub><Text style={{ color: t.healthy ? C.primaryDark : C.danger }}>{t.weeklyLoss.toFixed(2)} kg/semana</Text></Row>
        {!t.healthy && <Sub style={{ color: C.danger, marginTop: 6 }}>Ritmo acima do recomendado. Considere aumentar o prazo nas configurações.</Sub>}
      </Card>

      <Card>
        <Title>Marcos de validação</Title>
        {ms.map(m => {
          const reached = m.date <= new Date();
          const real = reached ? sorted.filter(w => new Date(w.date) <= m.date).pop()?.weight : undefined;
          return (
            <Row key={m.months} style={s.item}>
              <View><Text style={{ fontWeight: '700' }}>{m.months === 12 ? '1 ano' : `${m.months} meses`}</Text><Sub>{m.date.toLocaleDateString('pt-BR')}</Sub></View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text>Esperado: {m.expected} kg</Text>
                {real !== undefined && <Text style={{ color: real <= m.expected ? C.primaryDark : C.danger }}>Real: {real} kg {real <= m.expected ? '✅' : '⚠️'}</Text>}
              </View>
            </Row>
          );
        })}
      </Card>

      <Card>
        <Title>Cardápio sugerido para você</Title>
        <Sub style={{ marginBottom: 6 }}>Baseado em ~{t.targetKcal} kcal, suas preferências e alergias.</Sub>
        {diet.map(m => (
          <View key={m.meal} style={s.item}>
            <Text style={{ fontWeight: '700' }}>{m.meal}</Text>
            {m.items.map(i => <Sub key={i.food.id}>• {clean(i.food.name)} — {i.grams} g (~{Math.round(i.food.kcal * i.grams / 100)} kcal)</Sub>)}
          </View>
        ))}
      </Card>

      <Card>
        <Title>✅ Priorize</Title>
        <Sub>{[...advice.proteins, ...advice.salads, ...advice.fruits].map(f => clean(f.name)).join(', ')}</Sub>
      </Card>
      <Card>
        <Title>🚫 Evite / reduza</Title>
        <Sub>{advice.avoid.map(f => clean(f.name)).join(', ')}</Sub>
        {advice.blockedByAllergy.length > 0 && (
          <><Text style={{ fontWeight: '700', marginTop: 8, color: C.danger }}>Por alergia/restrição:</Text>
            <Sub>{advice.blockedByAllergy.map(f => clean(f.name)).join(', ')}</Sub></>
        )}
      </Card>
      <Sub style={{ fontSize: 12, textAlign: 'center' }}>Os valores são estimativas. Procure um nutricionista/médico para acompanhamento.</Sub>
    </ScrollView>
  );
}
