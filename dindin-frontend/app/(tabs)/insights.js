import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { API_URL } from '../../constants/api.js';

const categorySetup = {
  1: { name: 'Alimentação', color: '#E86363', icon: 'fast-food' },
  2: { name: 'Transporte', color: '#63E8B7', icon: 'bus' },
  3: { name: 'Lazer', color: '#63AEE8', icon: 'game-controller' },
  4: { name: 'Moradia', color: '#3a2674', icon: 'home' },
  5: { name: 'Geral', color: '#e22bcaff', icon: 'wallet' },
};

export default function InsightsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryColor, setSelectedCategoryColor] = useState('#fff');

  const fetchTip = async (categoryId, color) => {
    setIsLoading(true);
    setSelectedCategoryColor(color);
    setModalVisible(true);

    try {
      
      const url = categoryId ? `${API_URL}/api/tips?categoryId=${categoryId}` : `${API_URL}/api/tips`;
      console.log("Buscando dica", url);
      const response = await fetch(url);
      const data = await response.json();

      setCurrentTip(data.tip);

    } catch (error) {
      setCurrentTip("Não foi possivel carregar a dica agora.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Central de Dicas</Text>
        <Text style={styles.subtitle}>Toque para receber uma dica!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {Object.keys(categorySetup).map((key) => {
          const cat = categorySetup[key];
          return(
            <TouchableOpacity
              key={key}
              style={[styles.card, { backgroundColor: cat.color }]}
              onPress={() => fetchTip(key, cat.color)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={cat.icon} size={32} color="white"/>
              </View>
              <Text style={styles.cardText}>Como economizar em {cat.name}?</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#333', marginTop: 10 }]}
          onPress={() => fetchTip(null, "#333")}
        >
          <View style={styles.iconContainer}>
            <FontAwesome5 name="lightbulb" size={28} color="white"/>
          </View>
          <Text style={styles.cardText}>Dica Financeira Rápida</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderTopColor: selectedCategoryColor }]}>
            <Text style={[styles.modalTitle, { color: selectedCategoryColor }]}>
              Dica DinDin
            </Text>

            {isLoading ? (
              <ActivityIndicator size="large" color={selectedCategoryColor} style={{ margin: 20 }}/>
            ) : (
              <Text style={styles.tipText}>"{currentTip}"</Text>
            )}

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: selectedCategoryColor }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Ok</Text>
            </TouchableOpacity>
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
    marginBottom: 10 
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
    marginTop: 5, 
    fontFamily: 'BricolageGrotesque-Regular' 
  },
  
  gridContainer: { 
    padding: 20, 
    paddingBottom: 40 
  },
  
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 50, height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    fontFamily: 'BricolageGrotesque-Bold' 
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderTopWidth: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'BricolageGrotesque-Bold'
  },
  tipText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
    fontStyle: 'italic',
    fontFamily: 'BricolageGrotesque-Regular'
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});