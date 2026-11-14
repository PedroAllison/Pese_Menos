import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/store/AppContext';
import { C } from './src/components/ui';
import HomeScreen from './src/screens/HomeScreen';
import MealsScreen from './src/screens/MealsScreen';
import WaterScreen from './src/screens/WaterScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import PlanScreen from './src/screens/PlanScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const icon = (e: string) => ({ focused }: { focused: boolean }) => <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{e}</Text>;

function Root() {
  const { state, loaded } = useApp();
  if (!loaded) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={C.primary} /></View>;
  if (!state.profile) return <View style={{ flex: 1, paddingTop: 40, backgroundColor: C.bg }}><ProfileScreen /></View>;
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: C.primary, headerTitleStyle: { fontWeight: '700' } }}>
        <Tab.Screen name="Início" component={HomeScreen} options={{ tabBarIcon: icon('🏠'), title: 'Pese Menos' }} />
        <Tab.Screen name="Refeições" component={MealsScreen} options={{ tabBarIcon: icon('🍽️') }} />
        <Tab.Screen name="Água" component={WaterScreen} options={{ tabBarIcon: icon('💧') }} />
        <Tab.Screen name="Exercícios" component={ExerciseScreen} options={{ tabBarIcon: icon('🔥') }} />
        <Tab.Screen name="Plano" component={PlanScreen} options={{ tabBarIcon: icon('📈') }} />
        <Tab.Screen name="Ajustes" component={SettingsScreen} options={{ tabBarIcon: icon('⚙️') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
