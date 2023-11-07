import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, FlatList, Button, ScrollView, Pressable, TextInput
} from "react-native";
import * as Font from "expo-font";
import {getAllOrders} from "../consts/orders";
import foodCategories from "../consts/foodCategories";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

const { width, height } = Dimensions.get("window");

const NotificationsScreen = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [isAtEndOfList, setIsAtEndOfList] = useState(false);
    const [orders, setOrders] = useState([]);
    const [orders2, setOrders2] = useState([]);
    // if the user is a customer then the information that it should load should be delivery notifications l
    // ike your driver is nearby or come and pick up your food
    // if the user is a driver
    // then the notifications should be the list of all deliveries that they are open to
    useEffect(() => {
        // Set orders data here, for example, after an API call.
        // Avoid setting orders in the render method.
        const dummyorders = [
            {
                name: "John Doe",
                location: "East Campus",
                cart: [{
                    imageURL: "https://azucaryoregano.com/wp-content/uploads/2021/01/cronut3.jpg",
                    name: "Choc mousse cronut",
                    price: "12",
                    restaurantName: "Xpresso"
                },{
                    imageURL: "https://pickfreshfoods.com/wp-content/uploads/2014/06/Chocolate-Frosted-Donuts-Pick-Fresh-Foods-9.jpg",
                    name: "chocolate doughnut",
                    price: "12",
                    restaurantName: "Xpresso"
                },
                    {
                        imageURL: "https://azucaryoregano.com/wp-content/uploads/2021/01/cronut3.jpg",
                        name: "afsjklsalkjflkds ",
                        price: "12",
                        restaurantName: "Xpresso"
                    }],
            },
            {
                name: "John Doe",
                location: "East Campus",
                cart:[{
                    imageURL: "https://azucaryoregano.com/wp-content/uploads/2021/01/cronut3.jpg",
                    name: "2 cronut",
                    price: "12",
                    restaurantName: "Xpresso"
                }]
            },
            {
                name: "John Doe",
                location: "East Campus",
                cart:[{
                    imageURL: "https://azucaryoregano.com/wp-content/uploads/2021/01/cronut3.jpg",
                    name: "3 cronut",
                    price: "12",
                    restaurantName: "Xpresso"
                }]
            },
            // Add more dummy orders as needed
        ];

        setOrders(dummyorders);
    }, []);
    //
    // useEffect(() => {
    //     const getOrders = getAllOrders();
    //     console.log(getOrders)
    //     setOrders2(getOrders)
    // }, []);
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
        const cardHeight = 165 + cartItems.length*15;
        const [showComplete, setShowComplete] = useState(false);
        const [accepted, setAccepted] = useState(true);
        const [pin, setPin] = useState("")

        const handlePinChange = (text) => {
            setPin(text);
        };
        const handleDecline = () => {
            console.log("declined")
        //     BACKEND INTEGRATION??
        }
        const handleAccept = () => {
            console.log("accepted");
            setAccepted(false);
            setShowComplete(true);
        }
        const handleComplete = () => {
            console.log("completed");
        //     need to add backend
        }



        return (
            <View style={{...styles.LogCard, height: cardHeight}}>

                <View
                    style={{
                        height: cardHeight,
                        marginLeft: 20,
                        paddingVertical: 5,
                        flex: 1,
                    }}
                >
                    {orders.length === 0 ? (
                        <View>
                            <Text>No orders</Text>
                        </View>
                    ) : (
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 0,
                                    right: 15,
                                }}
                            >
                                <Image
                                    source={require("../assets/profile.jpg")}
                                    style={{ height: 60, width: 60, borderRadius:50 }}
                                />
                                <View style={{ marginLeft: 30 }}>
                                    <Text style={styles.boldSubtext}>
                                        Delivery
                                    </Text>
                                    <Text style={styles.subText}>
                                        From: {item.name}
                                    </Text>

                                    <Text style={styles.subText}>
                                        Restaurant: {restaurantName}
                                    </Text>
                                    <Text style={styles.subText}>
                                        Location: {item.location}
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
                                        Time: 10:00
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>
                <View style={{flexDirection:"row"}}>
                    {accepted && (
                        <View style={{ marginBottom: 50, paddingLeft: width-200}}>
                            <Pressable
                                style={styles.actionBtn}
                                onPress={() => handleAccept()}
                            >
                                <Text style={styles.actionBtnText}>Accept</Text>
                            </Pressable>
                        </View>
                    )
                    }
                    {accepted && (
                        <View style={{ marginBottom: 50, paddingLeft: 50}}>
                            <Pressable
                                style={styles.actionBtn2}
                                onPress={() => handleDecline()}
                            >
                                <Text style={styles.actionBtnText}>X</Text>
                                {/*<Text style={{alignContent:"center", fontFamily:"Urbanist-Bold", color: "white"}}>x</Text>*/}

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
                                onPress={() => handleComplete()}
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
                                onPress={() => handleComplete()}
                            >
                                <Text style={styles.actionBtnText}>Report</Text>
                            </Pressable>
                        </View>
                    )
                    }


                </View>
            </View>


        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>

                    <Text style={[styles.heading, styles.boldText]}>My Delivery Notifications</Text>
                </View>
                {orders.length === 0 ? (
                    <View style={styles.noordersContainer}>
                        <Image
                            source={require('../assets/sad.png')}
                            style={styles.noordersImage}
                        />
                        <Text style={styles.noordersText}>Activate Deliveries to get delivery notifications</Text>
                    </View>
                ) : (
                    <View style={{marginTop:90}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            data={orders}
                            renderItem={({ item }) => <LogCard item={item} />}
                        />
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
        backgroundColor: '#5DBB63',
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
        backgroundColor: '#5DBB63',
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
    actionBtn2: {
        height: 40,
        width: 40,
        backgroundColor: 'red',
        marginBottom: 10,
        borderRadius: 25,
        position: 'absolute',
        top: 0,
        right: 0,
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
