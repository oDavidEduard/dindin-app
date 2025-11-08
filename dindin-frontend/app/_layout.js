import React from 'react';
import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="login"
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="register"
        options={{ title: 'Cadastro' }}
      />
      <Stack.Screen 
        name="setup"
        options={{ title: 'Configuração Inicial' }}
      />
      <Stack.Screen
        name="dashboard"
        options={{ title: 'Dashboard' }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="addExpenseModal"
        options={{
          presentation: "modal",
          title: "Adicionar gasto",
        }}
      />
    </Stack>
  );
}