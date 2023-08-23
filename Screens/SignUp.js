import {Dimensions, SafeAreaView, Text, TextInput, View, StyleSheet, Button, Pressable} from "react-native";
const { width, height } = Dimensions.get('window');
import * as Font from "expo-font";
import {useEffect, useState} from "react";
import colors from "../colors";
const SignUpScreen = () =>{
    const [fontLoaded, setFontLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handleStudentNumberChange = (text) => {
        setStudentNumber(text);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const onSignInPressed = () => {
        console.log("sign up")
    }

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
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.boldText]}>Sign Up</Text>
                <Text style={[styles.boldText, styles.subHeadings]}>Username</Text>
                <TextInput
                    onChangeText={handleUsernameChange}
                    value={username}
                    style={[styles.regularText, styles.input]}
                    placeholder="Username"
                />
                <Text style={[styles.boldText, styles.subHeadings]}>Student Number</Text>
                <TextInput
                    onChangeText={handleStudentNumberChange}
                    value={studentNumber}
                    style={[styles.regularText, styles.input]}
                    placeholder="Student Number"
                />
                <Text style={[styles.boldText, styles.subHeadings]}>Email</Text>
                <TextInput
                    onChangeText={handleEmailChange}
                    value={studentNumber}
                    style={[styles.regularText, styles.input]}
                    placeholder="Email"
                />
                <Text style={[styles.boldText, styles.subHeadings]}>Password</Text>
                <TextInput
                    onChangeText={handlePasswordChange}
                    value={studentNumber}
                    style={[styles.regularText, styles.input]}
                    placeholder="Password"
                />
                <Pressable style={styles.pressable}>
                    <Text style={styles.regularText}> SIGN IN </Text>
                </Pressable>
            </View>
        </SafeAreaView>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F5F9",
    },
    header: {
        marginTop: height * 0.18,
        flexDirection: 'column',
        alignItems: 'left',
        marginHorizontal: width * 0.05,
        position:"absolute"
    },
    regularText: {
        fontFamily: 'Urbanist-Regular',
    },
    boldText: {
        fontFamily: 'Urbanist-Bold',
    },
    heading: {
        fontSize: 36,
    },
    subHeadings:{
        fontSize:16,
        marginTop: 0.03*height,
        marginBottom: 0.006*height,
    },
    input:{
        display: "flex",
        flexDirection: "column",
        alignItems:"flex-start",
        backgroundColor:"white",
        padding:16,
        width:0.9*width,
        borderRadius: 12,
        // fontFamily:
    },
    pressable:{
        // borderRadius: 12,
        backgroundColor: colors.primary,
        width: '100%',
        padding: 20,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,

    }

})

export default SignUpScreen;

