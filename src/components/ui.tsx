import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

export const C = {
  bg: '#f4f7f5', card: '#ffffff', primary: '#16a34a', primaryDark: '#15803d', text: '#1f2937',
  muted: '#6b7280', border: '#e5e7eb', danger: '#dc2626', warn: '#f59e0b', blue: '#0ea5e9',
};

export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[s.card, style]}>{children}</View>
);

export const Title = ({ children }: { children: React.ReactNode }) => <Text style={s.title}>{children}</Text>;
export const Sub = ({ children, style }: { children: React.ReactNode; style?: any }) => <Text style={[s.sub, style]}>{children}</Text>;

export const Btn = ({ title, onPress, variant = 'primary', small }: { title: string; onPress: () => void; variant?: 'primary' | 'outline' | 'danger'; small?: boolean }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [s.btn, small && s.btnSmall, variant === 'outline' && s.btnOutline, variant === 'danger' && { backgroundColor: C.danger }, pressed && { opacity: 0.7 }]}>
    <Text style={[s.btnText, variant === 'outline' && { color: C.primary }, small && { fontSize: 13 }]}>{title}</Text>
  </Pressable>
);

export const Field = ({ label, ...props }: TextInputProps & { label: string }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput placeholderTextColor="#9ca3af" style={s.input} {...props} />
  </View>
);

export function Chips<T extends string | number>({ options, value, onChange, multi }: {
  options: { id: T; label: string }[]; value: T | T[]; onChange: (v: any) => void; multi?: boolean;
}) {
  const sel = (id: T) => (multi ? (value as T[]).includes(id) : value === id);
  return (
    <View style={s.chips}>
      {options.map(o => (
        <Pressable key={String(o.id)} onPress={() => {
          if (!multi) return onChange(o.id);
          const arr = value as T[];
          onChange(arr.includes(o.id) ? arr.filter(x => x !== o.id) : [...arr, o.id]);
        }} style={[s.chip, sel(o.id) && s.chipOn]}>
          <Text style={[s.chipText, sel(o.id) && { color: '#fff' }]}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export const Progress = ({ value, color = C.primary }: { value: number; color?: string }) => (
  <View style={s.track}><View style={[s.fill, { width: `${Math.max(0, Math.min(100, value * 100))}%`, backgroundColor: color }]} /></View>
);

export const Row = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, style]}>{children}</View>
);

export const num = (t: string) => parseFloat(t.replace(',', '.')) || 0;

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 18, fontWeight: '700', color: C.text, marginBottom: 8 },
  sub: { fontSize: 14, color: C.muted },
  label: { fontSize: 13, color: C.muted, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, fontSize: 16, color: C.text, backgroundColor: '#fafafa' },
  btn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginVertical: 4 },
  btnSmall: { paddingVertical: 7, paddingHorizontal: 12 },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: '#fff' },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontSize: 13, color: C.text },
  track: { height: 10, backgroundColor: '#e5e7eb', borderRadius: 5, overflow: 'hidden', marginVertical: 6 },
  fill: { height: '100%', borderRadius: 5 },
  big: { fontSize: 44, fontWeight: '800', color: C.text },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
});
