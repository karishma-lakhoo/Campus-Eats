import {SafeAreaView, Text, View, StyleSheet, Dimensions} from "react-native";
import {useEffect, useState} from "react";
import * as Font from "expo-font";
const { width, height } = Dimensions.get('window');

const LoginScreen =() =>{
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'Urbanist-Regular': require('../Fonts/Urbanist-Regular.ttf'),
                'Urbanist-Bold': require('../Fonts/Urbanist-Bold.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    if (!fontLoaded) {
        return null; // You can return a loading indicator or something here
    }
    return(
        <SafeAreaView style={styles.header}>
            <Text style={[styles.heading, styles.bold_text]}>Login Screen</Text>
        </SafeAreaView>)
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: height * 0.18,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.05,
    },
    heading: {
        fontSize: 36,
    },
    bold_text:{
        fontFamily: 'Urbanist-Bold',
    },
    container: {
        flex: 1,
    }
});


export default LoginScreen;