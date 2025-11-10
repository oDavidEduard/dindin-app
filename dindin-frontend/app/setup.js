import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import { API_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SetupScreen(){

    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "BricolageGrotesque-Regular": require("../assets/fonts/BricolageGrotesque-Regular.ttf"),
        "BricolageGrotesque-Bold": require("../assets/fonts/BricolageGrotesque-Bold.ttf"),
        "Montserrat-Bold.ttf": require("../assets/fonts/Montserrat-Bold.ttf"),        
    })

    const [monthlyIncome, setMonthlyIncome] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleSetup = async () => {

        const incomeValue = parseFloat(monthlyIncome);
        if (!incomeValue || incomeValue <= 0){
            alert("Digite um valor válido.");
            return;
        }

        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem("userToken");

            if(!token){
                alert("Erro de autenticação, por favor tente novamente.");
                router.replace("/login");
                return;
            }

            const response = await fetch(`${API_URL}/auth/setup`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    monthlyIncome: incomeValue,
                }),
            });

            const data = await response.json();

            if (!response.ok){
                alert(data.error || "Erro ao salvar a renda.");
            } else {
                alert("Renda salva com sucesso!");
                await AsyncStorage.setItem("monthlyIncome", incomeValue.toString());
                router.replace("/(tabs)");
            }

        } catch (error) {
            console.error("Erro de rede.", error);
            alert("Não foi possível conectar ao servidor.");
        } finally {
            setIsLoading(false);
        }

    };
    
    return(
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }}/>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                    <Image source={require("../assets/images/flecha-roxa.png")} style={styles.flechaImg}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Me diz, qual a{"\n"}sua <Text style={styles.purpleTitle}>renda</Text>{"\n"} mensal?
                </Text>
                </View>

                <TextInput
                    style={styles.input}
                    value={monthlyIncome}
                    onChangeText={setMonthlyIncome}
                    keyboardType='numeric'
                    editable={!isLoading}
                />

                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSetup} disable={isLoading}>
                        {isLoading ? (
                        <ActivityIndicator color="#fff"/> ) : (
                            <Text style={styles.buttonText}>Enviar</Text>
                        )}
                        <Image source={require("../assets/images/seta-direita.png")} style={styles.setaImg}/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeArea:{
        flex: 1,
        backgroundColor:"#ffffffff",
    },
    container:{
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "space-between",
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 5,
        paddingBottom: 15,
        backgroundColor: '#ffffffff',
        width: '100%',       
    },
    headerButton:{
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#ffffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    flechaImg:{
        width: 24,
        height: 24,
        resizeMode: "contain",
        tintColor: '#3a2674',
    },
    titleContainer:{
        marginTop: 80,
    },
    title:{
        fontSize: 40,
        fontFamily: "BricolageGrotesque-Bold",
        color: "#000",
        marginBottom: 40,
        textAlign: "center",
        lineHeight: 48,
    },
    purpleTitle:{
        fontSize: 40,
        color: "#4b3199ff",
        fontFamily: "BricolageGrotesque-Bold",
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 25,
        fontSize: 16,
        textAlign: 'left',
        height: 58,
        marginTop:30,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "center",
        marginBottom: 40,
        width: "100%",
        paddingHorizontal: 0, 
    },
    button: {
        width: "100%",
        backgroundColor: '#6643cd',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: "BricolageGrotesque-Regular",
        marginRight: 8,
    },
    setaImg:{
        width: 15,
        height: 15,
        resizeMode: "contain", 
        tintColor: '#fff',
    },
});