import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Modal, TextInput, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../constants/api.js';

const categorySetup = {
  1: { name: 'Alimentação', color: '#E86363', icon: 'fast-food' },
  2: { name: 'Transporte', color: '#63E8B7', icon: 'bus' },
  3: { name: 'Lazer', color: '#63AEE8', icon: 'game-controller' },
  4: { name: 'Moradia', color: '#3a2674', icon: 'home' },
  5: { name: 'Outros', color: '#e22bcaff', icon: 'ellipsis-horizontal' },
};

export default function GoalsScreen(){
  const [budgets, setBudgets] = useState({});
  const [currentSpends, setCurrentSpends] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const now = new Date();
  const currentMonthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;

  const loadData = async () => {

    setIsLoading(true);

    try {

      const token = await AsyncStorage.getItem('userToken');
      if(!token) return;

      const resBudgets = await fetch(`${API_URL}/api/budgets?monthYear=${currentMonthYear}`, {
        headers: { 'Authorization': `Bearer ${token}`}
      });

      const dataBudgets = await resBudgets.json();

      const budgetMap = {};

      if(resBudgets.ok){
        dataBudgets.forEach(b => {
          budgetMap[b.categoryId] = parseFloat(b.amountLimit);
        });
      }

      setBudgets(budgetMap);

      const resExpenses = await fetch(`${API_URL}/api/expenses`, {
        headers: { 'Authorization': `Bearer ${token}`}
      });

      const dataExpenses = await resExpenses.json();

      const spendMap = {};

      if(resExpenses.ok){
        dataExpenses.forEach(exp => {
          const expDate = new Date(exp.date);

          if(expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()){
            const catId = exp.categoryId;
            if(!spendMap[catId]) spendMap[catId] = 0;
            spendMap[catId] += parseFloat(exp.amount);
          }
        });
      }

      setCurrentSpends(spendMap);

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possivel carregar os dados')
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const openSetBudget = (categoryId) => {
    setSelectedCategory(categoryId);

    const currentLimit = budgets[categoryId] ? budgets[categoryId].toString() : '';
    setNewLimit(currentLimit);
    setModalVisible(true);
  };

  const handleSaveBudget = async () => {
    if(!newLimit || parseFloat(newLimit) < 0){
      Alert.alert('Insira um valor válido.');
      return;
    }

    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId: selectedCategory,
          amountLimit: parseFloat(newLimit.replace(',', '.')),
          monthYear: currentMonthYear
        })
      });

      if(response.ok){
        setModalVisible(false);
        loadData();
      } else {
        Alert.alert('Erro', 'Falha ao salvar meta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderGoalItem = ({ item }) => {
    const categoryId = parseInt(item);
    const config = categorySetup[categoryId];

    const limit = budgets[categoryId] || 0;
    const spent = currentSpends[categoryId] || 0;

    let percentage = 0;
    if(limit > 0){
      percentage = (spent / limit) * 100;
      if(percentage > 100) percentage = 100;
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => openSetBudget(categoryId)}>
        <View style={styles.cardHeader}>
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: config.color }]}>
              <Ionicons name={config.icon} size={20} color='white'/>
            </View>
            <Text style={styles.categoryName}>{config.name}</Text>
          </View>
          <View>
            {limit > 0 ? (
              <Text style={styles.limitText}>
                <Text style={{fontWeight: 'bold', color: config.color}}>
                  R$ {spent.toFixed(0)}
                </Text>
                {' '}/ R$ {limit.toFixed(0)}
              </Text>
            ) : (
              <Text style={styles.setGoalText}>Definir Meta</Text>
            )}
          </View>
        </View>
        
        {/*barra de progresso*/}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${percentage}`,
                backgroundColor: percentage >= 100 ? 'red' : config.color
              }
            ]}
          />
        </View>

        {limit > 0 && (
          <Text style={styles.statusText}>
            {spent > limit? 'Você excedeu o limite!' : `${(100 - percentage).toFixed(0)}% restante`}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Metas</Text>
        <Text style={styles.subtitle}>Planejamento de {currentMonthYear}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size='large' color='#6A1B9A' style={{marginTop: 50}}/>
      ) : (
        <FlatList
          data={Object.keys(categorySetup)}
          keyExtractor={(item) => item}
          renderItem={renderGoalItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Meta para {selectedCategory ? categorySetup[selectedCategory].name : ''}
            </Text>
            <Text style={styles.modalLabel}>Qual seu limite de gastos mensal?</Text>

            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              keyboardType='numeric'
              value={newLimit}
              onChangeText={setNewLimit}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveBudget}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color='white'/>
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
  },

  header: { 
    padding: 24, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#000', 
    fontFamily: 'BricolageGrotesque-Bold' 
  },

  subtitle: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4, 
    fontFamily: 'BricolageGrotesque-Regular' 
  },
  
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },

  iconRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  iconCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 },

  categoryName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  
  setGoalText: { 
    fontSize: 14, 
    color: '#6A1B9A', 
    fontWeight: 'bold' 
  },

  limitText: { 
    fontSize: 14, 
    color: '#666' 
  },
  
  progressBarBackground: { 
    height: 8, 
    backgroundColor: '#eee', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },

  progressBarFill: { 
    height: '100%', 
    borderRadius: 4 
  },
  
  statusText: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 8, 
    textAlign: 'right' 
  },

  //Modal Styles

  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },

  modalContent: { 
    width: '85%', 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center' 
  },

  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },

  modalLabel: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 20, 
    textAlign: 'center' 
  },

  input: { 
    width: '100%', 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    fontSize: 18, 
    marginBottom: 24, 
    textAlign: 'center' 
  },

  modalButtons: { 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between' 
  },

  button: { 
    flex: 1, 
    height: 50, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 5 
  },

  cancelButton: { 
    backgroundColor: '#eee' 
  },

  saveButton: { 
    backgroundColor: '#6A1B9A' 
  },
  
  cancelButtonText: { 
    color: '#333', 
    fontWeight: '600' 
  },

  saveButtonText: { 
    color: 'white', 
    fontWeight: 'bold' },

});