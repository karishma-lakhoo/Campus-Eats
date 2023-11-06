import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, FlatList, Button, ScrollView, Pressable
} from "react-native";
import * as Font from "expo-font";

import foodCategories from "../consts/foodCategories";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

const { width, height } = Dimensions.get("window");

const NotificationsScreen = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [isAtEndOfList, setIsAtEndOfList] = useState(false);
    const [invites, setInvites] = useState([]);
    // if the user is a customer then the information that it should load should be delivery notifications l
    // ike your driver is nearby or come and pick up your food
    // if the user is a driver
    // then the notifications should be the list of all deliveries that they are open to
    useEffect(() => {
        // Set invites data here, for example, after an API call.
        // Avoid setting invites in the render method.
        const dummyInvites = [
            {
                id: 1,
                senderName: "John Doe",
                senderLocation: "New York",
            },
            {
                id: 2,
                senderName: "Alice Smith",
                senderLocation: "Los Angeles",
            },
            {
                id: 3,
                senderName: "Bob Johnson",
                senderLocation: "Chicago",
            },
            // Add more dummy invites as needed
        ];

        setInvites(dummyInvites);
    }, []);


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

    const handleDecline = () => {
        console.log("declined")
    }
    const handleAccept = () => {
        console.log("accepted")
    }

    const LogCard = ({ item }) => {
        return (
            <View style={styles.LogCard}>
                <View
                    style={{
                        height: 100,
                        marginLeft: 20,
                        paddingVertical: 20,
                        flex: 1,
                    }}
                >
                    {invites.length === 0 ? (
                        <View>
                            <Text>No invites</Text>
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
                                    style={{ height: 50, width: 50 }}
                                />
                                <View style={{ marginLeft: 30 }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            marginTop: 8,
                                            marginLeft: -15,
                                        }}
                                    >
                                        asdfasdf
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            marginTop: 0,
                                            marginLeft: -15,
                                        }}
                                    >
                                        From sdfsddf
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>
                <View style={{ marginBottom: 40, right: 60 }}>
                    <Pressable
                        style={styles.actionBtn}
                        onPress={() => handleAccept()}
                    >
                        <Text style={styles.actionBtnText}>Accept</Text>
                    </Pressable>
                </View>
                <View style={{ marginBottom: 40, right: 10 }}>
                    <Pressable
                        style={styles.actionBtn2}
                        onPress={() => handleDecline()}
                    >
                        <Text style={styles.actionBtnText}>X</Text>
                        {/*<Text style={{alignContent:"center", fontFamily:"Urbanist-Bold", color: "white"}}>x</Text>*/}

                    </Pressable>
                </View>
            </View>

        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Image
                            source={require("../assets/back_thick.png")}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.heading, styles.boldText]}>My Notifications</Text>
                </View>
                {invites.length === 0 ? (
                    <View style={styles.noInvitesContainer}>
                        <Image
                            source={require('../assets/sad.png')}
                            style={styles.noInvitesImage}
                        />
                        <Text style={styles.noInvitesText}>No notifications as yet</Text>
                    </View>
                ) : (
                    <View style={{marginTop:90}}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        data={invites}
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
    boldText: {
        fontFamily: "Urbanist-Bold",
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
    inviteContainer: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inviteText: {
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
        flexDirection: 'row',
        alignItems: 'center',
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
    noInvitesContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 160,
    },
    noInvitesImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 20
    },
    noInvitesText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default NotificationsScreen;
