import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from "expo-font";
import { AntDesign } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function index() {

    const router = useRouter();

    const [fontsLoaded] = useFonts({
        "BricolageGrotesque-Regular": require("../assets/fonts/BricolageGrotesque-Regular.ttf"),
        "BricolageGrotesque-Bold": require("../assets/fonts/BricolageGrotesque-Bold.ttf"),
        "Montserrat-Bold.ttf": require("../assets/fonts/Montserrat-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <View style={styles.dindinLogoContainer}>
                    <Image source={require("../assets/images/dindin-logo.png")} style={styles.dindinLogo} />
                </View>
                <Text style={styles.dindinTextLogo}>dindin.</Text>
            </View>

            <View style={styles.mainContentArea}>
                <Text style={styles.mainTitle}>Mês{"\n"}apertou?</Text>

                <Text style={styles.helpText}>
                    A <Text style={styles.dindinPurpleText}>DinDin</Text> te ajuda!
                </Text>

                <Image
                    source={require("../assets/images/central-image.png")}
                    style={styles.centralImage}
                    resizeMode="contain"
                />

                <Text style={styles.bottomSubtitle}>
                    Controle seus gastos com{"\n"}inteligência e leveza!
                </Text>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => router.push("/register")}
                >
                    <Text style={styles.registerButtonText}>Cadastrar</Text>
                    <AntDesign name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push("/login")}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                    <AntDesign name="arrow-right" size={20} color="#6643cd" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#ffffffff',
        width: '100%',
        height: 60,
        zIndex: 10,
    },
    dindinLogoContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',

    },
    dindinLogo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        borderRadius: 6,
    },
    dindinTextLogo: {
        fontSize: 16,
        fontFamily: "Montserrat-Bold",
        color: '#3a2674',
        position: 'absolute',
        right: 20,
        top: 25,
    },
    mainContentArea: {
        flex: 1,
        backgroundColor: '#ffffffff',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: height * 0.05,
    },
    mainTitle: {
        fontSize: 48,
        fontFamily: "BricolageGrotesque-Bold",
        color: '#000',
        lineHeight: 52,
        textAlign: 'center',
        marginBottom: 10,
    },
    helpText: {
        fontSize: 32,
        fontFamily: "BricolageGrotesque-Bold",
        color: '#000',
        lineHeight: 38,
        textAlign: 'center',
        marginBottom: 30,
    },
    dindinPurpleText: {
        color: '#6643cd',
        fontFamily: "BricolageGrotesque-Bold",
    },
    centralImage: {
        width: width * 0.8,
        height: height * 0.3,
        marginBottom: 30,
    },
    bottomSubtitle: {
        fontSize: 16,
        fontFamily: "BricolageGrotesque-Regular",
        color: '#000000ff',
        textAlign: 'center',
        lineHeight: 15,
        marginTop: 0,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 30,
        paddingTop: 20,
    },
    registerButton: {
        width: "90%",
        backgroundColor: '#6643cd',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 15,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: "BricolageGrotesque-Regular",
        marginRight: 8,
    },
    loginButton: {
        width: "90%",
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
    },
    loginButtonText: {
        color: '#ffffffff',
        fontSize: 18,
        fontFamily: "BricolageGrotesque-Regular",
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 8,
    }
});