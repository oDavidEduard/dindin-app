import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import { API_URL } from "../constants/api.js";

export default function RegisterScreen(){

    const router = useRouter();

    const [fontsLoaded] = useFonts({
      "BricolageGrotesque-Regular": require("../assets/fonts/BricolageGrotesque-Regular.ttf"),
      "BricolageGrotesque-Bold": require("../assets/fonts/BricolageGrotesque-Bold.ttf"),
  });

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword){
            alert("As senhas não coincidem!");
            return;
        }

        if (!name || !email || !password || !confirmPassword){
            alert("Preencha os campos.");
            return;
        }

        setIsLoading(true);

        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              email: email,
              password: password,
              confirmPassword: confirmPassword,
            }),

          });

          const data = await response.json();

          if (!response.ok){
            alert(data.error || "Erro ao tentar se cadastrar.");
          } else {
            alert(`Seja bem-vindo, ${name}!`);
            router.push("/setup");
          }

        } catch (error) {
          
          console.error("Erro de rede", error);
          alert("Não foi possivel conectar ao servidor.");
          
        } finally {

          setIsLoading(false);
        }
    };

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }}/>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.dindinLogoContainer}>
                    <Image source={require("../assets/images/flecha-roxa.png")} style={styles.dindinLogo}/>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>

                <Text style={styles.subtitle}>Seja um{" "}
                    <Text style={styles.purpleText}>DinDiner</Text>
                {" "}imediatamente!</Text>
                <Text style={styles.title}>Cadastro</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize='words'
                    editable={!isLoading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    editable={!isLoading}                    
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isLoading} 
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirmar senha"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!isLoading} 
                />

                <View style={styles.bottomContainer}>
                    <Text style={styles.bottomText}>Pronto para{"\n"}
                        <Text style={styles.purpleText1}>salvar</Text>
                        {""} sua vida{"\n"} financeira?
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disable={isLoading}>
                      {isLoading ? (
                        <ActivityIndicator color="#fff"/> ) : (
                          <Text style={styles.buttonText}>Cadastrar</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
    backgroundColor: "#ffffffff",
    paddingTop: 20,
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#ffffffff',
    width: '100%',
  },
  dindinLogoContainer:{
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
    
  },
  dindinLogo:{
    width: 40,
    height: 40,
    resizeMode: "contain",
    borderRadius: 6,
  },
  setaImg:{
    width: 40,
    height: 20,
    resizeMode: "contain", 
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    textAlign:"center",
    fontFamily: "BricolageGrotesque-Regular",
  },
  title: {
    fontSize: 32,
    color: '#000',
    marginBottom: 30,
    textAlign:"center",
    fontFamily: "BricolageGrotesque-Bold",
  },
    input: {
    width: '85%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "BricolageGrotesque-Regular",
    shadowColor: "#000",
    shadowOffset:{
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
},
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  bottomText: {
    fontSize: 31,
    color: '#000',
    textAlign: 'center',
    marginBottom: 100,
    fontFamily: "BricolageGrotesque-Bold",
    lineHeight: 30,
  },
  button: {
    width: "85%",
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
    purpleText: {
    color: '#3a2674',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
    textAlign:"center",
    fontFamily: "BricolageGrotesque-Bold",
    },

    purpleText1: {
    color: '#3a2674',
    fontFamily: "BricolageGrotesque-Bold",
    fontSize: 31,
    marginBottom: 30,
    },
});