import React from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen(){
    const router = useRouter();

    const handleLogout = async () =>{
        await AsyncStorage.removeItem("userToken")
        router.replace("/");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text>Login realizado</Text>
            <Button title="sair" onPress={handleLogout}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});