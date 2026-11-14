import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useApp } from '../store/AppContext';
import { MEAL_LABELS, MealItem, MealType } from '../store/types';
import { FOODS, Food, MEASURES } from '../data/foods';
import { Btn, C, Card, Chips, Field, num, Row, s, Sub, Title } from '../components/ui';
import { todayKey } from '../logic/calc';

const mealOptions = (Object.keys(MEAL_LABELS) as MealType[]).map(id => ({ id, label: MEAL_LABELS[id] }));

function guessMeal(): MealType {
  const h = new Date().getHours();
  if (h < 10) return 'cafe';
  if (h < 12) return 'lanche_manha';
  if (h < 15) return 'almoco';
  if (h < 18) return 'cafe_tarde';
  if (h < 22) return 'janta';
  return 'ceia';
}

export default function MealsScreen() {
  const { state, addMeal, removeMeal } = useApp();
  const p = state.profile!;
  const [type, setType] = useState<MealType>(guessMeal());
  const [items, setItems] = useState<MealItem[]>([]);
  const [query, setQuery] = useState('');
  const [food, setFood] = useState<Food | null>(null);
  const [measure, setMeasure] = useState('colher_sopa');
  const [qty, setQty] = useState('1');
  // alimento personalizado
  const [custom, setCustom] = useState(false);
  const [cName, setCName] = useState('');
  const [cKcal, setCKcal] = useState('');

  const results = useMemo(() => {
    const q = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (!q) return [];
    return FOODS.filter(f => f.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q)).slice(0, 8);
  }, [query]);

  const addItem = () => {
    if (custom) {
      if (!cName || !num(cKcal)) return Alert.alert('Informe nome e calorias aproximadas.');
      setItems([...items, { foodId: 'custom', name: cName, measureId: 'porcao', quantity: 1, grams: 0, kcal: num(cKcal), protein: 0, carbs: 0, fat: 0 }]);
      setCName(''); setCKcal(''); setCustom(false);
      return;
    }
    if (!food) return;
    const m = MEASURES.find(x => x.id === measure)!;
    const grams = m.grams * num(qty);
    const f = grams / 100;
    if ((food.tags ?? []).some(t => p.allergies.includes(t))) Alert.alert('Atenção ⚠️', `${food.name} contém algo da sua lista de alergias.`);
    setItems([...items, {
      foodId: food.id, name: food.name, measureId: measure, quantity: num(qty), grams,
      kcal: Math.round(food.kcal * f), protein: +(food.protein * f).toFixed(1), carbs: +(food.carbs * f).toFixed(1), fat: +(food.fat * f).toFixed(1),
    }]);
    setFood(null); setQuery(''); setQty('1');
  };

  const save = () => {
    if (!items.length) return;
    addMeal({ date: todayKey(), type, items });
    setItems([]);
    Alert.alert('Refeição registrada ✅', `${items.reduce((s, i) => s + i.kcal, 0)} kcal adicionadas.`);
  };

  const todayMeals = state.meals.filter(m => m.date === todayKey());
  const total = items.reduce((s, i) => s + i.kcal, 0);

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Card>
        <Title>Registrar refeição</Title>
        <Chips options={mealOptions} value={type} onChange={setType} />

        {!custom ? (
          <>
            <Field label="Buscar alimento" placeholder="ex: arroz, frango, salada..." value={query} onChangeText={t => { setQuery(t); setFood(null); }} />
            {results.map(f => (
              <Pressable key={f.id} onPress={() => { setFood(f); setQuery(f.name); setMeasure(f.liquid ? 'copo' : f.category === 'salada' ? 'prato_raso' : 'colher_sopa'); }} style={s.item}>
                <Row><Text>{f.name}</Text><Sub>{f.kcal} kcal/100g</Sub></Row>
              </Pressable>
            ))}
            {food && (
              <View style={{ marginTop: 8 }}>
                <Sub>Medida usada</Sub>
                <Chips options={MEASURES.map(m => ({ id: m.id, label: `${m.label}${m.id === 'g' ? '' : ` (~${m.grams}g)`}` }))} value={measure} onChange={setMeasure} />
                <Field label={measure === 'g' ? 'Quantos gramas?' : 'Quantidade'} keyboardType="decimal-pad" value={qty} onChangeText={setQty} />
                <Sub>≈ {Math.round(food.kcal * (MEASURES.find(m => m.id === measure)!.grams * num(qty)) / 100)} kcal</Sub>
                <Btn title="+ Adicionar à refeição" onPress={addItem} />
              </View>
            )}
            <Btn small variant="outline" title="Não achei – informar manualmente" onPress={() => setCustom(true)} />
          </>
        ) : (
          <>
            <Field label="O que você comeu?" value={cName} onChangeText={setCName} />
            <Field label="Calorias aproximadas (kcal)" keyboardType="numeric" value={cKcal} onChangeText={setCKcal} />
            <Btn title="+ Adicionar" onPress={addItem} />
            <Btn small variant="outline" title="Voltar à busca" onPress={() => setCustom(false)} />
          </>
        )}
      </Card>

      {items.length > 0 && (
        <Card>
          <Title>{MEAL_LABELS[type]} — {total} kcal</Title>
          {items.map((i, idx) => (
            <Row key={idx} style={s.item}>
              <View style={{ flex: 1 }}><Text>{i.name}</Text><Sub>{i.grams ? `${i.grams} g · ` : ''}P {i.protein}g C {i.carbs}g G {i.fat}g</Sub></View>
              <Text style={{ fontWeight: '700' }}>{i.kcal}</Text>
              <Pressable onPress={() => setItems(items.filter((_, j) => j !== idx))}><Text style={{ color: C.danger, marginLeft: 12 }}>✕</Text></Pressable>
            </Row>
          ))}
          <Btn title="Salvar refeição" onPress={save} />
        </Card>
      )}

      <Card>
        <Title>Refeições de hoje</Title>
        {todayMeals.length === 0 && <Sub>Nenhuma refeição registrada ainda.</Sub>}
        {todayMeals.map(m => (
          <Pressable key={m.id} onLongPress={() => Alert.alert('Excluir refeição?', '', [{ text: 'Cancelar' }, { text: 'Excluir', style: 'destructive', onPress: () => removeMeal(m.id) }])} style={s.item}>
            <Row><Text style={{ fontWeight: '700' }}>{MEAL_LABELS[m.type]}</Text><Text>{m.items.reduce((s, i) => s + i.kcal, 0)} kcal</Text></Row>
            <Sub>{m.items.map(i => i.name.replace(/\s*\(.*\)/, '')).join(', ')}</Sub>
          </Pressable>
        ))}
        {todayMeals.length > 0 && <Sub style={{ marginTop: 6, fontSize: 12 }}>Segure uma refeição para excluir.</Sub>}
      </Card>
    </ScrollView>
  );
}
