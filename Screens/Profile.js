import React, { useEffect, useState } from "react";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toggle from "react-native-toggle-element";
import colors from "../colors";
import { faUserEdit, faUser, faEnvelope, faPencil, faWallet, faStar} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


console.log(launchImageLibrary)
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback,
    Button,
    Switch
} from "react-native";
import * as Font from "expo-font";
import { FontAwesome5 } from '@expo/vector-icons';
import { PFPpopup } from "../PopUps/PFPpopup";
import Colors from "../colors";
import { signOut } from "firebase/auth";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
    let popupRef = React.createRef();
    const [fontLoaded, setFontLoaded] = useState(false);

    // Delivery status
    const [toggleValue, setToggleValue] = useState(false);

    //options for the image picker
    let options = {
        title: 'Select Avatar',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
    };

    // This function is currently not working, still trying to figure it out @Panda
    const pickFromGallery = () => {
        console.log("adding picture.....")
        launchImageLibrary(options, (response) => {
            console.log("adding picture.....")
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
              this.setState({
                avatarSource: source,
              });
            }
          });
    };

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

    let student_name = "Potlaki"; // Replace this with data from DB of the logged-in user
    let student_email = "Potlaki@wits.students";
    let credits = 0;
    let student_number = "257382";

    const handleAdd = () => {
        popupRef.show();
        console.log('Add button pressed');
    };

    const onClosePopup = () => {
        popupRef.close()
    }

    return (
        <SafeAreaView style={styles.safecontainer}>
            <View style={styles.container}>
                <View>
                    <View style={styles.header}>
                        <Text style={styles.heading}>{student_name}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.addpfp}>
                        <TouchableWithoutFeedback onPress={handleAdd}>
                            <FontAwesome5 name="plus" size={24} color="white" />
                        </TouchableWithoutFeedback>
                        <PFPpopup
                            title="Profile Picture"
                            ref={(target) => (popupRef = target)}
                            onTouchOutside={onClosePopup}
                        />
                    </View>
                    <View style={styles.profileImage}>
                        <Image
                            source={require("../assets/avatar.png")}
                            style={styles.image}
                            resizeMode="center"
                        />
                    </View>
                </View>
            </View>
                
            <View style={styles.updateSection}>
                <View style={{flexDirection: "row", padding: 10}}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Student Number: {student_number}
                    </Text>
                </View>

                <View style={[styles.smallContainer, {justifyContent: "space-between"}]} >
                    <View style={{flexDirection: "row"}}>
                        <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                        <Text style={styles.textInfo}>
                            {student_email}
                        </Text>
                    </View>

                    <TouchableOpacity 
                        onPress={()=>{
                            navigation.navigate("UpdateProfile")
                        }}>
                        <FontAwesomeIcon icon={faPencil} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.smallContainer} 
                    onPress={() => {
                        navigation.navigate('CreditWallet');
                    }}>
                    <FontAwesomeIcon icon={faWallet} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Credit Wallet: {credits} Kudu
                    </Text>
                </TouchableOpacity>

                {toggleValue && (
                    <View style={styles.smallContainer}>
                        <FontAwesomeIcon icon={faStar} style={styles.icon} />
                        <Text style={styles.textInfo}>
                            Ratings: 1
                        </Text>
                    </View>
                )}
            </View>

            <View style={{flexDirection:'row', width:'70%', padding: 20, alignItems: "center"}}>
                <Text style={styles.text}> Delivery Status             </Text>
                <View style={{width: 10}}>
                    <Toggle
                        thumbButton={{
                            activeBackgroundColor: "white",
                            inActiveBackgroundColor: "white"
                        }}
                        trackBarStyle={{
                            borderColor: toggleValue ? 'green' : 'grey', // Change borderColor based on toggleValue
                            backgroundColor: toggleValue ? 'green' : 'grey', // Change backgroundColor based on toggleValue
                        }}

                        trackBar={{
                            radius: 30,
                            borderWidth: 9,
                            width: 80,
                            height: 40
                        }}
                        value={toggleValue}
                        onPress={(newState) => setToggleValue(newState)}
                        // leftTitle="Off"
                        // rightTitle="On"
                    />
                </View>
            </View>

            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <TouchableOpacity activeOpacity={0.7} style={styles.btncontainer} onPress={() => console.log("signout")}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
                
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

    profileImage: {
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
        width: '90%',
        padding: 20,
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
    updateIcon: {
        marginRight: 10,
        marginVertical: 10,
        position: "relative",
        justifyContent: "space-evenly"
    },

    updateSection : {
        borderRadius: 10,
        flex: 1,
        alignContent: "flex-start",     
        padding: 20,
        justifyContent: "space-evenly"
    },
});

export default ProfileScreen;
