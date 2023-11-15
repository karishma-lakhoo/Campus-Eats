import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Image, TouchableWithoutFeedback, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { faUserEdit, faUser, faEnvelope, faWallet, faStar } from '@fortawesome/free-solid-svg-icons';
import { PFPpopup } from '../PopUps/PFPpopup';
import Colors from '../colors'; // Import the colors module here
import { getAuth, onAuthStateChanged , signOut} from 'firebase/auth';
import { collection, getFirestore,updateDoc, query, where, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const { width, height } = Dimensions.get('window');
import Toggle from "react-native-toggle-element";
import md5 from 'md5';

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
  const [databaseStatus, setDatabaseStatus] = useState(false);
  
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        console.log('User is signed in:', authUser.email);
        const email = authUser.email;
  
        // Query Firestore to get the user's data
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('email', '==', email));
  
        try {
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Fetched user data:', userData);
            setUser(userData);
            
            // Set the initial value of toggle based on the fetched databaseStatus
            setToggleValue(userData.deliveryStatus);
            setDatabaseStatus(userData.deliveryStatus);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No user is signed in.');
        // No user is signed in. Handle this case as needed.
      }
    });
  
    return unsubscribe; // Cleanup when component unmounts
  }, []);
  
const updateDeliveryStatus = async (newState) => {
    // Log the current and new delivery status values
    console.log('Current Delivery Status:', databaseStatus);
    console.log('New Delivery Status:', newState);
  
    // Update the local state
    setToggleValue(newState);
  
    // Update the Firestore database using the email as a reference
    const email = auth.currentUser.email;
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('email', '==', email));
  
    try {
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].ref;
        console.log('Updating Delivery Status for user with email:', email);
  
        await updateDoc(userDoc, {
          deliveryStatus: newState,
        });
  
        console.log('Delivery Status updated in Firestore:', newState);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      // You can navigate to the login screen or any other screen after sign-out
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  const handleAdd = () => {
    popupRef.show();
    console.log('Add button pressed');
  };

  const onClosePopup = () => {
    popupRef.close()
}

    const gravatarUrl = `https://www.gravatar.com/avatar/${md5(user.email)}?s=200`;

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
                            source={{ uri: gravatarUrl }}
                            style={styles.image}
                            resizeMode="cover"
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

                <TouchableOpacity 
                    style={styles.smallContainer} 
                    onPress={() => {
                        navigation.navigate('CreditWallet');
                    }}>
                    <FontAwesomeIcon icon={faWallet} style={styles.icon} />
                    <Text style={styles.textInfo}>
                        Credit Wallet: {user.credits} Kudu
                    </Text>
                </TouchableOpacity>

                {/*removed this because we shouldnt be able to edit our student number or email*/}
                {/*<TouchableOpacity style={styles.smallContainer}  >*/}
                {/*    */}
                {/*    <FontAwesomeIcon icon={faUserEdit} style={styles.icon} />*/}
                {/*    <Text style={styles.textInfo}>*/}
                {/*        Edit profile*/}
                {/*    </Text>*/}
                {/*</TouchableOpacity>*/}

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
                <Text style={styles.text}> Delivery Status             </Text>
                <View style={{width: 10}}>
                <Toggle
  thumbButton={{
    activeBackgroundColor: "white",
    inActiveBackgroundColor: "white"
  }}
  trackBarStyle={{
    borderColor: toggleValue ? 'green' : 'grey',
    backgroundColor: toggleValue ? 'green' : 'grey',
  }}
  
  trackBar={{
    radius: 30,
    borderWidth: 9,
    width: 80,
    height: 40
  }}
  value={databaseStatus}
  onPress={(newState) => {
    console.log('Toggle Pressed. New State:', newState);
    // Call the function to update the Firestore database
    updateDeliveryStatus(newState);
  }}
/>
                </View>
            </View>


            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <TouchableOpacity activeOpacity={0.7} style={styles.btncontainer} onPress={handleSignOut}>
          <Text style={[styles.boldText, styles.pressableText]}>Sign Out</Text>
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
    boldText: {
        fontFamily: 'Urbanist-Bold',
    },
    pressableText:{
        color: "#FFF",
        fontSize:16
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
        marginTop: 30,
        width: 130,
        height: 130,
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
        bottom: 2,
        right: 2,
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
        padding: 20,
        marginTop: 30
    },
});

export default ProfileScreen;
