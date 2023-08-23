import {Dimensions, SafeAreaView, Text, View, StyleSheet} from "react-native";
const { width, height } = Dimensions.get('window');
import * as Font from "expo-font";
import {useEffect, useState} from "react";
const SignUpScreen = () =>{
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
        return null;
    }
    return(<SafeAreaView style={styles.header}>
            <Text style={styles.boldText}>SignUp</Text>
    </SafeAreaView>)
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: height * 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.05,
    },
    regularText: {
        fontFamily: 'Urbanist-Regular',
    },
    boldText: {
        fontFamily: 'Urbanist-Bold',
        fontSize: 30},

})

export default SignUpScreen;

