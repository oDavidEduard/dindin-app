import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, ActivityIndicator, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts } from "expo-font";
import { API_URL } from "../constants/api.js";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function addIncomeModal(){

    const [fontsLoaded] = useFonts({
        'BricolageGrotesque-Regular': require('../assets/fonts/BricolageGrotesque-Regular.ttf'),
        'BricolageGrotesque-Bold': require('../assets/fonts/BricolageGrotesque-Bold.ttf'),
    });

    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddIncome = async () => {
        const incomeToAdd = parseFloat(amount.replace(',', '.'));
        if(!incomeToAdd || incomeToAdd <= 0){
            alert("Por favor, insira um valor válido");
            return;
        }

        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem('userToken');
            const currentIncomeStr = await AsyncStorage.getItem('monthlyIncome');
            const currentIncome = currentIncomeStr ? parseFloat(currentIncomeStr) : 0;

            const newTotalIncome = currentIncome + incomeToAdd;

            const response = await fetch(`${API_URL}/auth/setup`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    monthlyIncome: newTotalIncome,
                })
            });

            const data = await response.json();

            if(response.ok){
                await AsyncStorage.setItem('monthlyIncome', newTotalIncome.toString());

                alert(`Sucesso! R$${incomeToAdd} adicionados!`);
                router.back();
            } else {
                alert(data.error || 'Erro ao adicionar saldo');
            }
        } catch (error) {
            console.error("Erro fatal:", error);
            alert("Erro de conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Ionicons name="wallet" size={40} color="#4CAF50"/>
                        <Text style={styles.title}>Adicionar Saldo</Text>
                    </View>

                    <Text style={styles.label}>Valor a adicionar(R$)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='0,00'
                        keyboardType='numeric'
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus={true}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAddIncome}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.buttonText}>Adicionar saldo</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
    },

  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center' 
    },

  header: { 
    alignItems: 'center', 
    marginBottom: 30 
    },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 10,
    fontFamily: "BricolageGrotesque-Bold",
    },

  subtitle: { 
    fontSize: 16, 
    color: '#666',
    fontFamily: "BricolageGrotesque-Bold",
    },

  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8,
    fontFamily: "BricolageGrotesque-Bold",
    },

  input: {
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12,
    paddingVertical: 16, 
    paddingHorizontal: 15, 
    fontSize: 24, 
    textAlign: 'center', 
    marginBottom: 24,
    color: '#4CAF50', 
    fontWeight: 'bold',
    fontFamily: "BricolageGrotesque-Bold",
    },

  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16, 
    borderRadius: 30, 
    alignItems: 'center', 
    marginBottom: 15,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    elevation: 3,
  },

  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    fontFamily: "BricolageGrotesque-Bold", 
},

  cancelButton: { 
    alignItems: 'center', 
    padding: 10 
},

  cancelButtonText: { 
    color: '#666', 
    fontSize: 16,
    fontFamily: "BricolageGrotesque-Bold",
}
});