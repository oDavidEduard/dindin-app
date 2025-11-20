import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from "expo-router";
import { API_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categorySetup = {
  1: { name: 'Alimentação', color: '#E86363' }, // Vermelho/Salmão
  2: { name: 'Transporte', color: '#63E8B7' }, // Verde/Menta
  3: { name: 'Lazer', color: '#63AEE8' },     // Azul
  4: { name: 'Moradia', color: '#3a2674' },    // Rosa
  5: { name: 'Outros', color: '#e22bcaff' },      // Roxo
};

export default function CategoryDetailScreen(){
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [expenses, setExpenses] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const categoryInfo = categorySetup[id] || categorySetup[5];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                const token = await AsyncStorage.getItem("userToken");

                const responseExpenses = await fetch(`${API_URL}/api/expenses?categoryId=${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await responseExpenses.json();
                if(responseExpenses.ok){
                    setExpenses(data);
                }

                const responsePred = await fetch(`${API_URL}/api/expenses/prediction?categoryId=${id}`, {
                  headers: { "Authorization": `Bearer ${token}` }
                });

                const dataPred = await responsePred.json();

                if(responsePred.ok){
                  setPrediction(dataPred);
                }

            } catch (error) {
                console.error("Erro de rede:", error);
                alert("Erro de conexão");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]);

    const totalSpentInCategory = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: categoryInfo.color }]}>
          <Stack.Screen options={{ headerShown: false }}/>
            <View style={[styles.header, { backgroundColor: categoryInfo.color }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="white"/>
                </TouchableOpacity>
                <Text style={styles.headerSubtitle}>Suas despesas em:</Text>
                <Text style={styles.headerTitle}>{categoryInfo.name}</Text>
                {/* calcular gastos */}
            </View>

            <View style={styles.contentContainer}>
                <View style={[styles.totalCard, { backgroundColor: categoryInfo.id }]}>
                    <Text style={styles.totalCardLabel}>Gastos em Nov/25</Text>
                    <Text style={styles.totalCardValue}>R$ {totalSpentInCategory.toFixed(2).replace(".",",")}</Text>
                </View>

                    {isLoading ? (
            <ActivityIndicator size="large" color={categoryInfo.color} />
            ) : (
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={<Text style={styles.listTitle}>Despesas com {categoryInfo.name.toLowerCase()}</Text>}
                renderItem={({ item }) => (
                <View style={styles.expenseItem}>
                    {/* ... (ícone da categoria aqui) ... */}
                    <View style={styles.expenseInfo}>
                    <Text style={styles.expenseDesc}>{item.name || 'Sem nome'}</Text>
                    <Text style={styles.expenseDetails}>
                        R$ {parseFloat(item.amount).toFixed(2).replace('.', ',')} - {new Date(item.date).toLocaleDateString('pt-BR')}
                    </Text>
                    </View>
                    <Text style={item.isEssential ? styles.tagEssential : styles.tagNonEssential}>
                    {item.isEssential ? "Essencial" : "Não-essencial"}
                    </Text>
                </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum gasto nesta categoria.</Text>}
            />
            )}
            
            {prediction && (
            <View style={[styles.predictionCard, { backgroundColor: categoryInfo.color }]}>
                <Text style={styles.predictionLabel}>Estimativa para o fim do mês:</Text>
                <Text style={styles.predictionValue}>R$ {prediction.prediction.toFixed(2).replace('.', ',')}
                  <Text style={{color: 'white', opacity: 0.8, marginTop: 5}}>{"\n"}
                    {prediction.status}
                  </Text>
                </Text>
            </View>
          )}
            </View>
        </SafeAreaView> 
    );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
  },
  totalCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalCardLabel: {
    fontSize: 14,
    color: 'black',
    opacity: 0.9,
  },
  totalCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  expenseItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  expenseInfo: { flex: 1 },
  expenseDesc: { fontSize: 16, fontWeight: 'bold' },
  expenseDetails: { fontSize: 14, color: 'gray' },
  tagEssential: { fontSize: 12, color: 'green', fontWeight: 'bold' },
  tagNonEssential: { fontSize: 12, color: 'orange', fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  predictionCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  predictionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

