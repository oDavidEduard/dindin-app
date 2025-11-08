import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { useFonts } from "expo-font";
import { API_URL } from "../../constants/api.js";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';


//Estado sem dados, gastos
const NoData = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyCard}>
      <Text style={styles.emptyText}>ainda não</Text>
      <Text style={styles.emptyText}>temos</Text>
      <Text style={styles.emptyText}>dados</Text>
      <Text style={styles.emptySubText}>adicione suas</Text>
      <Text style={styles.emptySubText}>despesas!</Text>
    </View>
  </View>
);

const DashboardHeader = ({ expenses }) => {

  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const saldo = 1518.00;

return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Olá, {"\n"}<Text style={styles.headerPurpleTitle}>David!</Text>
        </Text>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={20} color="#6A1B9A" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.saldoCard}>
        <View style={styles.gradientOverlay} />
        <Text style={styles.saldoLabel}>Seu saldo:</Text>
        <Text style={styles.saldoValue}>R$ {saldo.toFixed(2).replace('.', ',')}</Text>
      </View>

      <Text style={styles.totalSpentLabel}>Seu gasto até agora</Text>
      <Text style={styles.totalSpentValue}>R$ {totalSpent.toFixed(2).replace('.', ',')}</Text>

      <Text style={styles.listTitle}>Últimas despesas</Text>
    </View>
  );

};

export default function DashboardScreen(){

    const [fontsLoaded] = useFonts({
    'BricolageGrotesque-Regular': require('../../assets/fonts/BricolageGrotesque-Regular.ttf'),
    'BricolageGrotesque-Bold': require('../../assets/fonts/BricolageGrotesque-Bold.ttf'),

  });

    const router = useRouter();
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExpenses = async () => {
      setIsLoading(true);

      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/api/expenses`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();
        if(response.ok){
          setExpenses(data);
        } else {
          alert(data.error || "Erro ao buscar despesas");
        }

      } catch (error) {
        console.error("Erro de rede", error);
        alert("Erro de conexão.");

      } finally{
        setIsLoading(false);
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        fetchExpenses();
      }, [])
    );

    return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading && expenses.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6A1B9A" />
          </View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<DashboardHeader expenses={expenses} />}
            ListEmptyComponent={<NoData />}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseName}>{item.name || "Sem nome"}</Text>
                  <Text style={styles.expenseDetails}>
                    R$ {parseFloat(item.amount).toFixed(2).replace('.', ',')} - {new Date(item.date).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                
                <Text style={item.isEssential ? styles.tagEssential : styles.tagNonEssential}>
                  {item.isEssential ? "Essencial" : "Não-essencial"}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {/* Espaço para o botão FAB */}
        <TouchableOpacity 
          style={styles.btnAdd} 
          onPress={() => router.push("/addExpenseModal")}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "BricolageGrotesque-Regular",
    lineHeight: 28,
  },
  headerPurpleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6A1B9A',
    fontFamily: "BricolageGrotesque-Bold",
    lineHeight: 28,
  },
  profileButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saldoCard: {
    backgroundColor: '#1a0a2e',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    minHeight: 160,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    right: -80,
    top: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#6A1B9A',
    opacity: 0.25,
  },
  saldoLabel: {
    color: 'white',
    fontSize: 15,
    opacity: 0.85,
    marginBottom: 8,
    fontFamily: "BricolageGrotesque-Regular",
  },
  saldoValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: "BricolageGrotesque-Bold",
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  categoryItem: {
    alignItems: 'center',
    width: 64,
  },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6A1B9A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontFamily: "BricolageGrotesque-Regular",
  },
  totalSpentLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontFamily: "BricolageGrotesque-Regular",
  },
  totalSpentValue: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 32,
    fontFamily: "BricolageGrotesque-Bold",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 24,
    marginBottom: 16,
    fontFamily: "BricolageGrotesque-Bold",
  },
  expenseItem: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  expenseIconContainer: {
    marginRight: 14,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6A1B9A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1
  },
  expenseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: "BricolageGrotesque-Bold",
  },
  expenseDetails: {
    fontSize: 12,
    color: '#888',
    fontFamily: "BricolageGrotesque-Regular",
  },
  tagEssential: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    fontFamily: "BricolageGrotesque-Regular",
  },
  tagNonEssential: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    fontFamily: "BricolageGrotesque-Regular",
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyCard: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#6A1B9A',
    textAlign: 'center',
    lineHeight: 56,
    fontFamily: "BricolageGrotesque-Bold",
  },
  emptySubText: {
    fontSize: 40,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: "BricolageGrotesque-Regular",
  },
  btnAdd: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});