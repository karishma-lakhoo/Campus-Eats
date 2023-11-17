import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, FlatList, Button, ScrollView, Pressable, TextInput, Modal
} from "react-native";
import * as Font from "expo-font";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getFirestore,updateDoc, query, where, getDocs } from 'firebase/firestore';
import {acceptOrder, completeOrder, getAllOrders} from "../consts/orders";
import foodCategories from "../consts/foodCategories";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {serverTimestamp} from "firebase/firestore";
import  {useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import COLORS from "../colors";
import md5 from "md5";



const { width, height } = Dimensions.get("window");

const NotificationsScreen = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [isAtEndOfList, setIsAtEndOfList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allOrders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [deliveryStatus, setDeliveryStatus] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Entire Campus");
    const options = ["Entire Campus", "East", "West" ];
    const auth = getAuth();
    const db = getFirestore();

    const currentUser = auth.currentUser;
    let userUID;

    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }


    const ordersRef = collection(db, 'orders');
    const usersRef = collection(db, 'users');
    const fetchOrders = async () => {
        try{
            const q = query(ordersRef);
            const querySnapshot = await getDocs(q);

            const listOfOrders = [];

            for (const myDoc of querySnapshot.docs) {
                const id = myDoc.id; // Firestore document ID
                const data = myDoc.data();
                const orderersID = data.orderersID;
                const location = data.location;
                const cart = data.cart;
                let orderersName = "";
                const deliverer = data.deliverer;
                let delivererName = "";
                const delivered = data.delivered;
                let orderersEmail = "";
                let delivererEmail = "";
                const timePlaced = data.timestamp;
                const status = data.status;
                const received = data.received;
                const finalCost = data.totalCost;
                const userQuery = query(usersRef, where('__name__', '==', orderersID));

                const userSnapshot = await getDocs(userQuery);

                const pin = data.pin;
                if (!userSnapshot.empty) {
                    const userDoc = userSnapshot.docs[0];
                    const userData = userDoc.data();
                    orderersName = userData.username;
                    orderersEmail = userData.email;
                }
                if(deliverer){
                    const userQuery2 = query(usersRef, where('__name__', '==', deliverer));
                    const userSnapshot2 = await getDocs(userQuery2);
                    const userDoc2 = userSnapshot2.docs[0];
                    const userData2 = userDoc2.data();
                    delivererName = userData2.username;
                    delivererEmail = userData2.username;
                }

                listOfOrders.push({ id, orderersID, location, cart, orderersName, timePlaced, pin, delivererName, finalCost, status, received, delivered, orderersEmail, delivererEmail });
            }



            setOrders(listOfOrders);
            setLoading(false);
        } catch (error) {
            console.log('Error getting documents', error);
            setLoading(false);

        }
    }



    // useEffect(() => {
    //     if(!isOrdersLoading){
    //         setOrders(allOrders);
    //        // setOrders(allOrders);
    //     }
    // }, [isOrdersLoading, allOrders]);



    useEffect(() => {
        // Filter orders based on delivery status and selected option
        if(!loading){
        const filtered = allOrders.filter(item => {
            if (!item.delivered && item.orderersID !== userUID) { // Only include orders where delivered is false
                if (selectedOption === null || selectedOption === "Entire Campus") {
                    return true; // Include all orders when selectedOption is null or "Entire Campus"
                } else if (selectedOption === "East") {
                    return ["Chinese Latern", "Deli Delicious", "Jimmy's East Campus", "Love & Light", "Planet Savvy", "Sausage saloon", "Starbucks", "Xpresso"].includes(item.cart[0].restaurantName);
                } else if (selectedOption === "West") {
                    return ["Jimmy's West Campus", "The Tower", "Olives and Plates", "vida e caffe", "Zesty Lemonz"].includes(item.location);
                }
            }
            return false; // Exclude orders where delivered is true
        });

        // Sort the filtered orders by timePlaced in descending order
        const sortedFilteredOrders = filtered.sort((a, b) => b.timePlaced.toMillis() - a.timePlaced.toMillis());

        setFilteredOrders(sortedFilteredOrders);
    }
    }, [selectedOption, deliveryStatus, allOrders, loading]);
    const handleFilterPress = () => {
        toggleDropdown()
    };
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        toggleDropdown();
    };

    const fetchDeliveryStatus = async () => {
        try {
            // Get the user's email
            const email = auth.currentUser.email;

            // Update the Firestore database using the email as a reference
            const usersRef = collection(db, 'users');
            const userQuery = query(usersRef, where('email', '==', email));

            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                // Extract the delivery status from the user document
                const userDoc = querySnapshot.docs[0].data();
                const userDeliveryStatus = userDoc.deliveryStatus;

                // Update state based on the fetched status
                setDeliveryStatus(userDeliveryStatus);
            }
        } catch (error) {
            console.error('Error fetching delivery status:', error);
        }
    };

    useEffect(() => {
        // Fetch the delivery status when the component mounts
        fetchDeliveryStatus();
        fetchOrders();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchDeliveryStatus();
            fetchOrders();
        }, [])
    );

    // if the user is a customer then the information that it should load should be delivery notifications l
    // ike your driver is nearby or come and pick up your food
    // if the user is a driver
    // then the notifications should be the list of all deliveries that they are open to


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
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const containerHeight = event.nativeEvent.layoutMeasurement.height;

        // Check if the user has reached the end of the list
        if (offsetY + containerHeight >= contentHeight) {
            setIsAtEndOfList(true);
        } else {
            setIsAtEndOfList(false);
        }
    };



    const LogCard = ({ item }) => {
        const cartItems = item.cart;
        const restaurantName = item.cart[0].restaurantName;
        let totalPrice = 0;
        const cardHeight = 290 + cartItems.length*15;
        const [showComplete, setShowComplete] = useState(false);
        const [accepted, setAccepted] = useState(true);
        const [pin, setPin] = useState("")
        const options = {  hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric'};

        for(let i = 0; i < item.cart.length; i++){
            let price = item.cart[i].price.trim().replace(/[Rr]/g, '');
            totalPrice += parseFloat(price)
        }
        const handlePinChange = (text) => {
            setPin(text);
        };

        const handleAccept = (item) => {
            acceptOrder(item).then(() => {
                // This block will be executed after the acceptOrder promise is resolved
                setAccepted(false);
                setShowComplete(true);
               // setFilteredOrders(prevOrders => prevOrders.filter(order => order.accepted !== item.accepted));

                // Update the 'filtered' list
                // setFiltered((prevFiltered) => {
                //     return prevFiltered.map((filteredItem) => {
                //         // Assuming 'id' is a unique identifier for each item
                //         if (filteredItem.id === item.id) {
                //             // Update the specific item
                //             return { ...filteredItem, accepted: true };
                //         }
                //         return filteredItem; // Return unchanged items
                //     });
                // });
            });
        };


        const handleComplete = (item) => {

            if(pin === item.pin.toString()){
                completeOrder(item).then(() => {
                    setFilteredOrders(filteredOrders.filter(order => order.id !== item.id));
                });


            }else{
                alert("Incorrect pin");
            }

        }



        return (
            <View style={{...styles.LogCard, height: cardHeight}}>

                <View
                    style={{
                        height: cardHeight,
                        paddingVertical: 5,
                        flex: 1,
                    }}
                >
                    {allOrders.length === 0 ? (
                        <View>
                            <Text>No orders</Text>
                        </View>
                    ) : (
                        <>
                            <View style={{backgroundColor: 'rgba(255, 167, 38, 0.8)', alignItems: "center", height: 100, borderRadius: 10, marginTop: 5}}>
                                <Image
                                    source={{uri: `https://www.gravatar.com/avatar/${md5(item.orderersEmail)}?s=200`}}
                                    style={{ height: 80, width: 80, borderRadius: 50, marginTop: 10}}
                                    resizeMode= "cover"
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 0,
                                    right: 15,
                                }}
                            >
                                <View style={{ marginLeft: 30 }}>
                                    <Text style={styles.boldSubtext}>
                                        Delivery
                                    </Text>
                                    <Text style={styles.subText}>
                                        From: {item.orderersName}
                                    </Text>

                                    <Text style={styles.subText}>
                                        Restaurant: {restaurantName}
                                    </Text>

                                    {/* Render all the names of the items in the cart */}
                                    <View>
                                        <Text style={[styles.subText, styles.boldText]}>
                                            Items:
                                        </Text>
                                        {cartItems.map((cartItem, index) => (
                                            <Text style={{...styles.subText}} key={index}>
                                                {cartItem.name}
                                            </Text>
                                        ))}
                                    </View>
                                    <Text style={styles.subText}>
                                        Price: R{totalPrice}
                                    </Text>
                                    <Text style={styles.subText}>
                                        Time: {item.timePlaced.toDate().toLocaleString('en-US', options )}
                                    </Text>
                                    <Text style={styles.subText}>
                                        Meet-up spot: {item.location}
                                    </Text>
                                    {/*<Text style={styles.subText}>*/}
                                    {/*    DELIVERED: {item.delivered.toString()}*/}
                                    {/*</Text>*/}
                                </View>
                            </View>
                        </>
                    )}
                    <View style={{flexDirection:"row"}}>
                        {accepted && (
                            <View style={{ marginBottom: 50, paddingLeft: width/2 + 12}}>
                                <Pressable
                                    style={styles.actionBtn}
                                    onPress={() => handleAccept(item)}
                                >
                                    <Text style={styles.actionBtnText}>Accept</Text>
                                </Pressable>
                            </View>
                        )
                        }
                        { showComplete && (
                            <View style={{ marginBottom: 10, paddingLeft: 30}}>
                                <TextInput
                                    onChangeText={handlePinChange}
                                    value={pin}
                                    style={[styles.regularText, styles.textBoxes]}
                                    placeholder="Pin"
                                    keyboardType="numeric"></TextInput>
                            </View>
                        )
                        }
                        { showComplete && (
                            <View style={{ marginBottom: 10, paddingLeft: 90}}>
                                <Pressable
                                    style={styles.actionBtnComplete}
                                    onPress={() => handleComplete(item)}
                                >
                                    <Text style={styles.actionBtnText}>Complete</Text>
                                    <Text style={styles.actionBtnText}>order</Text>

                                </Pressable>
                            </View>
                        )
                        }
                        { showComplete && (
                            <View style={{ marginBottom: 10, paddingLeft: 90}}>
                                <Pressable
                                    style={styles.actionBtnReport}
                                    onPress={() => handleComplete(item)}
                                >
                                    <Text style={styles.actionBtnText}>Report</Text>
                                </Pressable>
                            </View>
                        )
                        }
                    </View>
                </View>

            </View>


        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={[styles.heading, styles.boldText]}>My Delivery Notifications</Text>
                    <View style={{paddingLeft:20}}>
                        <TouchableOpacity onPress={() => { handleFilterPress() }} style={styles.filter}>
                            <Image
                                source={require('../assets/Filter.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isDropdownVisible}
                            onRequestClose={toggleDropdown}
                        >
                            <TouchableWithoutFeedback onPress={toggleDropdown}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <FlatList
                                            data={options}
                                            keyExtractor={(item) => item}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity onPress={() => selectOption(item)}>
                                                    <Text style={styles.option}>{item}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>
                </View>
                <View>
                    {/*<View style={styles.filter}>*/}
                    {/*    <TouchableOpacity onPress={() => { handleFilterPress() }} style={styles.filter}>*/}
                    {/*        <Image*/}
                    {/*            source={require('../assets/Filter.png')}*/}
                    {/*            style={{ width: 24, height: 24 }}*/}
                    {/*        />*/}
                    {/*    </TouchableOpacity>*/}

                    {/*    <Modal*/}
                    {/*        animationType="fade"*/}
                    {/*        transparent={true}*/}
                    {/*        visible={isDropdownVisible}*/}
                    {/*        onRequestClose={toggleDropdown}*/}
                    {/*    >*/}
                    {/*        <TouchableWithoutFeedback onPress={toggleDropdown}>*/}
                    {/*            <View style={styles.modalContainer}>*/}
                    {/*                <View style={styles.modalContent}>*/}
                    {/*                    <FlatList*/}
                    {/*                        data={options}*/}
                    {/*                        keyExtractor={(item) => item}*/}
                    {/*                        renderItem={({ item }) => (*/}
                    {/*                            <TouchableOpacity onPress={() => selectOption(item)}>*/}
                    {/*                                <Text style={styles.option}>{item}</Text>*/}
                    {/*                            </TouchableOpacity>*/}
                    {/*                        )}*/}
                    {/*                    />*/}
                    {/*                </View>*/}
                    {/*            </View>*/}
                    {/*        </TouchableWithoutFeedback>*/}
                    {/*    </Modal>*/}
                    {/*</View>*/}
                </View>
                {deliveryStatus ? (
                    <View style={{ marginTop: 90 }}>
                        {/*<Text>SUMTING BRIKEN {allOrders.length}</Text>*/}
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            data={filteredOrders}
                            renderItem={({ item }) => <LogCard item={item} />}
                        />
                    </View>
                ) : (
                    <View style={styles.noordersContainer}>
                        <Image
                            source={require('../assets/sad.png')}
                            style={styles.noordersImage}
                        />
                        <Text style={styles.noordersText}>Activate Deliveries to get delivery notifications</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F5F9",
    },
    heading: {
        fontFamily: "Urbanist-Bold",
        fontSize: 26,
    },
    boldText: {
        fontFamily: "Urbanist-Bold",
    },
    textBoxes:{
        display: "flex",
        alignItems:"flex-start",
        backgroundColor:"white",
        padding:11,
        width:0.2*width,
        borderRadius: 12,
        borderWidth:0.2
    },
    regularText: {
        fontFamily: 'Urbanist-Regular',
    },
    contentContainer: {
        flex: 1,
        marginTop: height * 0.055,
    },
    header: {
        flexDirection: "row",
        alignItems:'center',
        paddingTop: height * 0.02,
        marginHorizontal: width * 0.05,
        position: "absolute",
    },
    itemContainer: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: "row",

    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 60,
    },
    flatListContainer:{
        flex:1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    flatContainer:{
        flex: 1,
        marginTop: height * 0.7,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 200,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    option: {
        fontFamily: "Urbanist-Bold",
        fontSize: 16,
        paddingVertical: 10,
    },
    itemImage: {
        position:"relative",
        width: "25%",
        height: 85,
        marginBottom: 10,
        borderRadius: 10,

    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        fontFamily: 'Urbanist-Regular',
        fontSize: 16,
        color: '#333',
    },
    category: {
        paddingLeft: 10,
        fontSize:18
    },
    subcategory: {
        paddingLeft: 10,
        fontSize:12,
        color: "gray"
    },
    rightButton: {
        marginLeft: "auto",
        marginRight: 10
    },
    bottomButton: {
        backgroundColor: "orange",
        width: "95%",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20, // Add margin from the bottom
    },
    bottomButtonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "Urbanist-Bold",
    },
    orderContainer: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderText: {
        fontSize: 16,
    },
    acceptButton: {
        backgroundColor: 'green',
        marginLeft: 10,
    },
    declineButton: {
        backgroundColor: "red",
        marginLeft: 10,
    },
    LogCard: {
        height: 100,
        borderRadius: 10,
        backgroundColor: 'white',
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 8, // This is for Android
    },
    actionBtn: {
        height: 40,
        width: 80,
        backgroundColor: '#50C878',
        marginBottom: 10,
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    actionBtn2: {
        height: 40,
        width: 80,
        backgroundColor: '#ff4c4c',
        marginBottom: 10,
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    actionBtnComplete: {
        height: 40,
        width: 80,
        backgroundColor: '#50C878',
        marginBottom: 10,
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    actionBtnReport: {
        height: 40,
        width: 80,
        backgroundColor: 'red',
        marginBottom: 10,
        borderRadius: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

    actionBtnText: {
        fontFamily:"Urbanist-Bold",
        color: "white",

    },
    noordersContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 160,
    },
    noordersImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 20
    },
    noordersText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    boldSubtext: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 8,
        marginLeft: -15,
    },
    subText: {
        fontSize: 12,
        marginTop: 0,
        marginLeft: -15,
    }
});

export default NotificationsScreen;