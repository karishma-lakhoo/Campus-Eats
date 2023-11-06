import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { faUserEdit, faUser, faEnvelope, faWallet, faStar } from '@fortawesome/free-solid-svg-icons';
import { PFPpopup } from '../PopUps/PFPpopup';
import Colors from '../colors'; // Import the colors module here
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore, query, where, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const { width, height } = Dimensions.get('window');
import Toggle from "react-native-toggle-element";

const ProfileScreen = ({ navigation }) => {
  let popupRef = React.createRef();
  const [user, setUser] = useState({
    name: 'Loading...',
    credits: 'Loading...',
    email: 'Loading...',
    student_number: 'Loading...',
  });
  const [fontLoaded, setFontLoaded] = useState(false);

  // Delivery status
  const [toggleValue, setToggleValue] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    async function loadFont() {
      // Load your fonts here
      // ...
    }
    loadFont();

    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
            console.log('User is signed in:', authUser.email); // Add this line
            // User is signed in, you can access authUser.email, authUser.uid, etc.
            // Now, fetch additional user data from Firestore based on their email or UID
            const email = authUser.email;

            // Query Firestore to get the user's data
            const usersRef = collection(db, 'users');
            const userQuery = query(usersRef, where('email', '==', email));

            try {
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    console.log('Fetched user data:', userData); // Add this line
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            console.log('No user is signed in.'); // Add this line
            // No user is signed in. Handle this case as needed.
        }
    });

    return unsubscribe; // Cleanup when component unmounts
}, []);


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
                        <Text style={styles.heading}>{user.username}</Text>
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
                <View style={{flexDirection: "row", padding: 10 }}>
                    <FontAwesomeIcon icon={faUser} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Student Number: {user.studentNum}
                    </Text>
                </View>

                <View style={styles.smallContainer} >
                    <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        {user.email}
                    </Text>
                </View>

                <View style={styles.smallContainer}  >
                    <FontAwesomeIcon icon={faWallet} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Credit Wallet: {user.credits} Kudu
                    </Text>
                </View>

                <TouchableOpacity style={styles.smallContainer}  >
                    
                    <FontAwesomeIcon icon={faUserEdit} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Edit profile
                    </Text>
                </TouchableOpacity>

                {toggleValue && (
                    <View style={styles.smallContainer}>
                        <FontAwesomeIcon icon={faStar} style={styles.icon} />
                        <Text style={styles.textInfo}>
                            Ratings: {user.rating}
                        </Text>
                    </View>
                )}
            </View>
            <View style={{height: 20}}>
            </View>

            <View style={{flexDirection:'row', width:'90%', padding: 20, alignItems: "center"}}>
                <Toggle 
                    thumbButton={{
                        activeBackgroundColor: "green",
                        inActiveBackgroundColor: "grey"
                    }}
                    trackBarStyle={{
                        borderColor: 'green',
                        backgroundColor: "#4DBA0F",
                    }}
                
                    trackBar={{
                        radius: 10,
                        borderWidth: 2
                    }}
                    value={toggleValue}
                    onPress={(newState) => setToggleValue(newState)}
                    leftTitle="Off"
                    rightTitle="On"
                />
                <Text style={styles.text}> Delivery Status</Text>
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
        backgroundColor: Colors.primary,
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
        fontSize: 28,
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
});

export default ProfileScreen;
