import {Dimensions, SafeAreaView, Text, View, StyleSheet} from "react-native";
const { width, height } = Dimensions.get('window');
import * as Font from "expo-font";
import {useEffect, useState} from "react";
const SignUpScreen = () =>{
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'Urbanist': require('../Fonts/Urbanist-Regular.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    if (!fontLoaded) {
        return null; // You can return a loading indicator or something here
    }
    return(<SafeAreaView style={styles.header}>
        <View>
            <Text style={styles.heading}>SignUp</Text>
        </View>
    </SafeAreaView>)
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: height * 0.03,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.05,
    },
    heading: {
        fontFamily: 'Urbanist',
        fontSize: 24,
    }

})

export default SignUpScreen;

