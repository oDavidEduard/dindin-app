import { Stack } from 'expo-router';

export default function AppLayout() {
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
    </Stack>
  );
}