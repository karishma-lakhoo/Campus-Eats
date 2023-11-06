import React, { useEffect, useState } from "react";
import colors from "../colors";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback,
    Button,
    Switch
} from "react-native";
import * as Font from "expo-font";
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../colors";

const { width, height } = Dimensions.get("window");

const UpdateScreen = ({ navigation }) => {
    let popupRef = React.createRef();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [new_email, setEmail] = useState("");
    
    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                "Urbanist-Regular": require("../Fonts/Urbanist-Regular.ttf"),
                "Urbanist-Bold": require("../Fonts/Urbanist-Bold.ttf"),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    if (!fontLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.header}>
                <Text style={styles.heading}>Email</Text>            
            </View>

           
            <View style={{padding:20}}>
                <View style={[styles.formGroup, {justifyContent: "center"}]} >
                        <Text style={styles.label}>Enter your new email:</Text>
                        <TextInput
                        style={styles.input}
                        value={new_email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
            </View>
            <View style={styles.container}>
                <View style={[styles.btncontainer]}>
                    <TouchableOpacity activeOpacity={0.7} onPress={()=>{
                        alert(`You changed your email to ${new_email}`);
                    }}>
                        <Text>Confirm changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F2F5F9",
        alignItems: 'center'
    },

    safecontainer: {
        backgroundColor: "#F2F5F9", 
    },

    heading: {
        fontFamily: "Urbanist-Bold",
        fontSize: 26,
    },
    header: {
        marginTop: height * 0.07,
        flexDirection: "column",
        marginHorizontal: width * 0.05,
        position: "relative",
    },
    btncontainer : {
        backgroundColor: colors.primary,
        width: '50%',
        padding: 15,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,
    },

    formGroup: {
        marginBottom: 16,
        paddingTop: 20,
    },
    label: {
        fontSize: 20,
        marginBottom: 8,
        fontFamily: 'Urbanist-Bold',
    },
    input: {
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
    },
});

export default UpdateScreen;
