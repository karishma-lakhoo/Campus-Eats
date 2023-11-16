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
import { getAuth } from 'firebase/auth';
import { getDoc,doc, getFirestore, updateDoc } from 'firebase/firestore';
import Colors from "../colors";

const { width, height } = Dimensions.get("window");

const CreditScreen = ({ navigation }) => {
    let popupRef = React.createRef();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [cash_in_amount, setAmount] = useState("");
    const [credits, setCredits] = useState(0);
    const [balance, setBalance] = useState(0); 
    
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

    const auth = getAuth();
    const db = getFirestore();

    const handleAddToWallet = async () => {
        try {
            // Get the current user's UID
            const uid = auth.currentUser.uid;
    
            // Reference to the user's document in the database
            const userDocRef = doc(db, 'users', uid);
    
            // Get the current credits from the database
            const userDoc = await getDoc(userDocRef);
            const currentCredits = userDoc.data().credits || 0;
    
            // Calculate the new credits by adding the entered amount
            const newCredits = currentCredits + parseFloat(cash_in_amount);
    
            // Update the credits field in the user's document
            await updateDoc(userDocRef, {
                credits: newCredits,
            });
    
            // Update the local state
            setCredits(newCredits);
    
            // Show an alert or navigate to another screen after a successful update
            alert(`Added ${cash_in_amount} credits to your account`);
            navigation.navigate("Profile");
        } catch (error) {
            console.error('Error updating credits:', error);
        }
    };
    

    const handleAdd = () => {
        popupRef.show();
        console.log('Add button pressed');
    };

    const onClosePopup = () => {
        popupRef.close()
    }

    return (
        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.header}>
                <Text style={styles.heading}>Credit Wallet</Text>            
            </View>

           
                <View style={styles.container}>
                    
                    <View style={styles.imageBox}>
                        <Image
                            source={require("../assets/24.jpg")}
                            style={styles.image}
                            resizeMode="center"
                        />
                    </View>
                    
                        {!credits && 
                            <View style={styles.noCredit}>
                                <Text style={styles.textInfo}> You have no credits</Text>
                                <Text style={{alignItems: "center", justifyContent: "center", fontSize: 11}}>Add credits to order food</Text>
                            </View>
                        }

                        {credits>0 && 
                            <View style={styles.noCredit}>
                                <Text style={styles.textInfo}> Credits: {credits} </Text>
                                <Text style={styles.textInfo} >Balance: {balance}</Text>
                            </View>
                        }

                        <View style={styles.formGroup} >
                            <Text style={styles.label}>Enter the amount you want to cash-in to your Campus-Eats account:</Text>
                            <TextInput
                                keyboardType='numeric'
                                maxLength={6}
                                style={styles.input}
                                value={cash_in_amount}
                                placeholder="0.0"
                                onChangeText={(text) => setAmount(text)}
                            />
                        </View>
                        
                        <View style={styles.btncontainer}>
                        <TouchableOpacity activeOpacity={0.7} onPress={handleAddToWallet}>
                                <Text>Add to wallet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
        

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F5F9",
        alignItems: "center"
    },

    safecontainer: {
        flex: 1,
        backgroundColor: "#F2F5F9",
    },

    smallContainer: {
        alignItems: "flex-start",
        borderColor: "#d3d3d3",
        borderTopWidth: 1,
        flexDirection: "row",
        padding: 10,
    },

    imageBox: {
        paddingTop: 0,
        marginTop: 50,
        width: 200,
        height: 200,
        borderRadius: 200,
        overflow: "hidden"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    addpfp: {
        backgroundColor: Colors.primary,
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1
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
        padding: 10,
        marginVertical: 40,
        alignItems:'center',
        borderRadius: 12,
    },
    text:{
        justifyContent: "center",
        fontFamily: 'Urbanist-Bold',
        alignContent: "center",
        fontSize: 20,
    },
    textInfo:{
        justifyContent: "center",
        fontFamily: 'Urbanist-Bold',
        alignContent: "center",
        fontSize: 20,
        padding: 5,
    },
    icon: {
        marginRight: 10,
        marginVertical: 10,
        position: "relative",
    },

    updateSection : {
        borderRadius: 10,
        flex: 1,
        alignContent: "flex-start",     
        padding: 20 
    },

    noCredit: {
        alignItems: "center"
    },

    formGroup: {
        marginBottom: 16,
        padding: 20
    },
    label: {
        fontSize: 11,
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
    },
});

export default CreditScreen;
