import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, ActivityIndicator, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFonts } from "expo-font";
import { API_URL } from "../constants/api.js";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const categoryItemsData = [
    { label: 'Alimentação', value: 1 },
    { label: 'Transporte', value: 2 },
    { label: 'Lazer', value: 3 },
    { label: 'Moradia', value: 4 },
    { label: 'Outros', value: 5 },
];

export default function AddExpenseModal() {

    const [fontsLoaded] = useFonts({
    'BricolageGrotesque-Regular': require('../assets/fonts/BricolageGrotesque-Regular.ttf'),
    'BricolageGrotesque-Bold': require('../assets/fonts/BricolageGrotesque-Bold.ttf'),
    });

    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [isEssential, setIsEssential] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [pickerOpen, setPickerOpen] = useState(false);
    const [categoryId, setCategoryId] = useState(1);
    const [categoryItems, setCategoryItems] = useState(categoryItemsData);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === "ios");
        setDate(currentDate);
    };

    const handleAddExpense = async () => {
        const expenseAmount = parseFloat(amount.replace(',', '.'));
        if(!expenseAmount || expenseAmount <= 0){
            alert("Por favor, insira um valor válido.");
            return;
        }

        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(`${API_URL}/api/expenses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    amount: expenseAmount,
                    description: description,
                    categoryId: categoryId,
                    date: date.toISOString(),
                    isEssential: isEssential,
                })
            });

            const data = await response.json();

            if(response.ok){
                alert("Despesa adicionada com sucesso!");
                router.back();
            } else{
                alert(data.error || "Erro ao adicionar despesa.");
            }
        } catch (error) {
            console.error("Erro de rede ao salvar despesa:", error);
            alert("Erro de conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.container}>

                    <Text style={styles.label}>Valor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0,00"
                        keyboardType='numeric'
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Almoço"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Qualquer coisa que queira acrescentar."
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <DropDownPicker
                        open={pickerOpen}
                        value={categoryId}
                        items={categoryItems}
                        setOpen={setPickerOpen}
                        setValue={setCategoryId}
                        setItems={setCategoryItems}
                        placeholder='Selecione uma categoria'
                        style={styles.input}
                        dropDownContainerStyle={styles.dropdownContainer}
                        listMode='SCROLLVIEW'
                        zIndex={1000}
                    />

                    <Text style={styles.label}>Data</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text>{date.toLocaleDateString('pt-BR')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Essencial?</Text>
                        <Switch
                            trackColor={{ false: "#767677", true: "#6A1B9A" }}
                            thumbColor={isEssential ? "#f4f3f4" : "#f4f3f4"}
                            onValueChange={setIsEssential}
                            value={isEssential}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAddExpense} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <Text style={styles.buttonText}>Salvar despesa</Text>
                        )}
                    </TouchableOpacity>
                    <View style={{ height:100 }}/>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f9f9' },
  container: { padding: 20 },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
    fontFamily: "BricolageGrotesque-Bold",
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "BricolageGrotesque-Regular",
    zIndex: 0,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    zIndex: -1,
  },
  button: {
    backgroundColor: '#6A1B9A', // Roxo
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    zIndex: -1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: "BricolageGrotesque-Regular",
    marginRight: 8,
  },
});