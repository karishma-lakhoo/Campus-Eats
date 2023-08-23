import React, { useEffect, useState } from 'react';
import {SafeAreaView, Text, TextInput, View, StyleSheet, Dimensions, Pressable} from 'react-native';
import * as Font from 'expo-font';
import colors from "../colors";

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.bold_text]}>Login Screen</Text>
                <View style={{marginTop: 40}}>
                    <Text style={[styles.bold_text, {marginTop: 0.03*height,fontSize: 16, marginBottom: 0.006*height}]}>Username</Text>
                    <TextInput
                        onChangeText={handleUsernameChange}
                        value={username}
                        style={styles.input}
                        placeholder="Username"
                    />
                    <Text style={[styles.bold_text, {marginTop: 0.03*height, fontSize: 16, marginBottom: 0.006*height}]}>Password</Text>
                    <TextInput
                        onChangeText={handlePasswordChange}
                        value={password}
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}

                    />
                    <Pressable style={styles.btncontainer}>
                        <Text style={[styles.text, styles.bold_text]}> SIGN IN </Text>
                    </Pressable>
                </View>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Text style={styles.reg_text}>Don't have an account?</Text>
                    <Pressable>
                        <Text style={[styles.bold_text, {color: 'red', textDecorationLine: 'underline'}]}> Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: height * 0.18,
        flexDirection: 'column', // Changed flexDirection to 'column'
        marginHorizontal: width * 0.05,
        position:"absolute"
    },
    container:{
        flex: 1,
        backgroundColor: "#F2F5F9",
    },
    heading: {
        fontSize: 36,
    },
    bold_text: {
        fontFamily: 'Urbanist-Bold',
    },
    reg_text: {
        fontFamily: 'Urbanist-Regular',
    },
    input: {
        display: "flex",
        flexDirection: "column",
        alignItems:"flex-start",
        backgroundColor:"white",
        padding:16,
        width:0.9*width,
        borderRadius: 12,
        // elevation: 5,
    },
    btncontainer : {
        backgroundColor: colors.primary,
        width: '100%',
        padding: 20,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,
    },
    text:{
        color:'white',
    },
});

export default LoginScreen;
