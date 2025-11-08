import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#6A1B9A', // Cor roxa
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 10 },
      }}
    >
      <Tabs.Screen
        name="index" // app/(tabs)/index.js
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerShown: false, // O design não tem cabeçalho
        }}
      />
      <Tabs.Screen
        name="goals" // app/(tabs)/goals.js
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" size={size} color={color} />
          ),
          headerTitle: 'Minhas Metas', // Título do cabeçalho
        }}
      />
      <Tabs.Screen
        name="insights" // app/(tabs)/insights.js
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="lightbulb" size={size} color={color} />
          ),
          headerTitle: 'Central de Insights', // Título do cabeçalho
        }}
      />
    </Tabs>
  );
}