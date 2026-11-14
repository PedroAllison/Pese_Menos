import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Switch, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../store/AppContext';
import { MEAL_LABELS, MealType } from '../store/types';
import { Btn, C, Card, Field, num, Row, s, Sub, Title } from '../components/ui';
import ProfileScreen from './ProfileScreen';
import { requestPermission } from '../logic/notifications';

const hhmm = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

export default function SettingsScreen() {
  const { state, saveSettings, resetAll } = useApp();
  const st = state.settings;
  const [editing, setEditing] = useState(false);
  const [picker, setPicker] = useState<MealType | 'morning' | null>(null);
  const [water, setWater] = useState(String(st.waterGoalMl));

  if (editing) return <ProfileScreen onDone={() => setEditing(false)} />;

  const pickerValue = () => {
    const d = new Date();
    if (picker === 'morning') d.setHours(st.morningMessage.hour, st.morningMessage.minute);
    else { const a = st.alarms.find(x => x.meal === picker)!; d.setHours(a.hour, a.minute); }
    return d;
  };

  const onPick = (_: any, date?: Date) => {
    const target = picker;
    setPicker(null);
    if (!date || !target) return;
    if (target === 'morning') saveSettings({ ...st, morningMessage: { ...st.morningMessage, hour: date.getHours(), minute: date.getMinutes() } });
    else saveSettings({ ...st, alarms: st.alarms.map(a => a.meal === target ? { ...a, hour: date.getHours(), minute: date.getMinutes() } : a) });
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Card>
        <Title>⏰ Alarmes das refeições</Title>
        <Sub style={{ marginBottom: 8 }}>Se você não registrar a refeição até 10 min após o horário, o app te avisa.</Sub>
        {st.alarms.map(a => (
          <Row key={a.meal} style={s.item}>
            <Text style={{ flex: 1 }}>{MEAL_LABELS[a.meal]}</Text>
            <Pressable onPress={() => setPicker(a.meal)}><Text style={{ color: C.primary, fontWeight: '700', marginRight: 12, fontSize: 16 }}>{hhmm(a.hour, a.minute)}</Text></Pressable>
            <Switch value={a.enabled} onValueChange={v => saveSettings({ ...st, alarms: st.alarms.map(x => x.meal === a.meal ? { ...x, enabled: v } : x) })} />
          </Row>
        ))}
      </Card>
      <Card>
        <Title>☀️ Mensagem motivacional</Title>
        <Row>
          <Pressable onPress={() => setPicker('morning')}><Text style={{ color: C.primary, fontWeight: '700', fontSize: 16 }}>{hhmm(st.morningMessage.hour, st.morningMessage.minute)}</Text></Pressable>
          <Switch value={st.morningMessage.enabled} onValueChange={v => saveSettings({ ...st, morningMessage: { ...st.morningMessage, enabled: v } })} />
        </Row>
      </Card>
      <Card>
        <Title>💧 Água</Title>
        <Field label="Meta diária (ml)" keyboardType="numeric" value={water} onChangeText={setWater} onBlur={() => num(water) > 0 && saveSettings({ ...st, waterGoalMl: num(water) })} />
        <Row><Text>Lembretes de água (11h, 15h, 18h)</Text><Switch value={st.waterReminder} onValueChange={v => saveSettings({ ...st, waterReminder: v })} /></Row>
      </Card>
      <Card>
        <Title>Perfil, metas e preferências</Title>
        <Sub style={{ marginBottom: 8 }}>Peso, meta, prazo do plano, alergias, gostos.</Sub>
        <Btn title="Editar perfil" variant="outline" onPress={() => setEditing(true)} />
        <Btn title="Testar permissão de notificações" variant="outline" onPress={async () => Alert.alert((await requestPermission()) ? 'Notificações ativas ✅' : 'Permissão negada – ative nas configurações do celular.')} />
      </Card>
      <Btn title="Apagar todos os dados" variant="danger" onPress={() => Alert.alert('Tem certeza?', 'Isso apaga todo o histórico.', [{ text: 'Cancelar' }, { text: 'Apagar', style: 'destructive', onPress: resetAll }])} />

      {picker && (
        <DateTimePicker value={pickerValue()} mode="time" is24Hour display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onPick} />
      )}
    </ScrollView>
  );
}
