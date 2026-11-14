import React, { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { useApp } from '../store/AppContext';
import { Activity, Profile, Sex } from '../store/types';
import { ALLERGENS, FOODS } from '../data/foods';
import { Btn, Card, Chips, Field, num, s, Sub, Title } from '../components/ui';
import { planTargets } from '../logic/calc';
import { requestPermission } from '../logic/notifications';

export default function ProfileScreen({ onDone }: { onDone?: () => void }) {
  const { state, saveProfile } = useApp();
  const p = state.profile;
  const [name, setName] = useState(p?.name ?? '');
  const [sex, setSex] = useState<Sex>(p?.sex ?? 'M');
  const [age, setAge] = useState(String(p?.age ?? ''));
  const [height, setHeight] = useState(String(p?.heightCm ?? ''));
  const [weight, setWeight] = useState(String(p?.startWeight ?? ''));
  const [goal, setGoal] = useState(String(p?.goalWeight ?? ''));
  const [activity, setActivity] = useState<Activity>(p?.activity ?? 'sedentario');
  const [months, setMonths] = useState<3 | 6 | 9 | 12>(p?.planMonths ?? 6);
  const [allergies, setAllergies] = useState<string[]>(p?.allergies ?? []);
  const [likes, setLikes] = useState<string[]>(p?.likes ?? []);
  const [dislikes, setDislikes] = useState<string[]>(p?.dislikes ?? []);

  const foodOpts = FOODS.map(f => ({ id: f.id, label: f.name.replace(/\s*\(.*\)/, '') }));

  const save = async () => {
    const prof: Profile = {
      name: name.trim() || 'Você', sex, age: num(age), heightCm: num(height), startWeight: num(weight),
      goalWeight: num(goal), activity, planMonths: months, startDate: p?.startDate ?? new Date().toISOString(),
      allergies, likes, dislikes: dislikes.filter(d => !likes.includes(d)),
    };
    if (!prof.age || !prof.heightCm || !prof.startWeight || !prof.goalWeight) {
      return Alert.alert('Preencha idade, altura, peso atual e meta.');
    }
    const t = planTargets(prof, prof.startWeight);
    if (!t.healthy) {
      Alert.alert('Atenção', `Perder ${(prof.startWeight - prof.goalWeight).toFixed(1)} kg em ${months} meses exige ~${t.weeklyLoss.toFixed(2)} kg/semana, acima do recomendado (até 1 kg/semana). Considere um prazo maior.`);
    }
    saveProfile(prof);
    await requestPermission();
    onDone?.();
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      {!p && <Text style={[s.title, { fontSize: 24 }]}>Bem-vindo ao Pese Menos 👋</Text>}
      <Card>
        <Title>Seus dados</Title>
        <Field label="Nome" value={name} onChangeText={setName} />
        <Sub>Sexo</Sub>
        <Chips options={[{ id: 'M', label: 'Masculino' }, { id: 'F', label: 'Feminino' }]} value={sex} onChange={setSex} />
        <Field label="Idade" keyboardType="numeric" value={age} onChangeText={setAge} />
        <Field label="Altura (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
        <Field label="Peso atual (kg)" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
        <Field label="Peso que quero chegar (kg)" keyboardType="decimal-pad" value={goal} onChangeText={setGoal} />
        <Sub>Nível de atividade no dia a dia</Sub>
        <Chips options={[{ id: 'sedentario', label: 'Sedentário' }, { id: 'leve', label: 'Leve' }, { id: 'moderado', label: 'Moderado' }, { id: 'intenso', label: 'Intenso' }]} value={activity} onChange={setActivity} />
        <Sub>Prazo do plano</Sub>
        <Chips options={[{ id: 3, label: '3 meses' }, { id: 6, label: '6 meses' }, { id: 9, label: '9 meses' }, { id: 12, label: '1 ano' }]} value={months} onChange={setMonths} />
      </Card>
      <Card>
        <Title>Alergias / restrições</Title>
        <Chips multi options={ALLERGENS} value={allergies} onChange={setAllergies} />
      </Card>
      <Card>
        <Title>Do que você gosta 😋</Title>
        <Chips multi options={foodOpts} value={likes} onChange={setLikes} />
      </Card>
      <Card>
        <Title>Do que você NÃO gosta 🙅</Title>
        <Chips multi options={foodOpts} value={dislikes} onChange={setDislikes} />
      </Card>
      <Btn title={p ? 'Salvar alterações' : 'Começar meu plano'} onPress={save} />
    </ScrollView>
  );
}
