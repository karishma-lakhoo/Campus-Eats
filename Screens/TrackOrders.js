import {
    SafeAreaView,
    TextInput,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Image, Pressable, ActivityIndicator
} from "react-native";
import React, {useEffect, useState} from "react";
import {acceptOrder, completeOrder, getAllOrders, getCurrentUsersOrders} from "../consts/orders";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import md5 from "md5";

const { width, height } = Dimensions.get("window");


const TrackOrdersScreen = ({navigation}) => {
    const [allOrders, isOrdersLoading] = getAllOrders();
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [userID, setUserID] = useState('');
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

    const filtered = allOrders.filter(item => item.orderersID === userUID)
    const sortedFilteredOrders = filtered.sort((a, b) => b.timePlaced.toMillis() - a.timePlaced.toMillis());

    // useEffect(() => {
    //     const filtered = allOrders.filter(item => item.orderersID === "3P6lxfR5LtX7tj6vsesSXH8cLT22");
    //     setFilteredOrders(filtered)
    //     console.log(filtered)
    //     });



    const LogCard = ({ item }) => {
        const cartItems = item.cart;
        const orderID = item.id;

        const options = {  hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric'};
        console.log(item.timePlaced.toDate().toLocaleString('en-US', options ))
        console.log(orderID)
        const restaurantName = item.cart[0].restaurantName;
        let totalPrice = 0;
        const cardHeight = 290 + cartItems.length*15;
        const [showComplete, setShowComplete] = useState(false);
        const [accepted, setAccepted] = useState(true);
        const [pin, setPin] = useState("")
        const [complete, setComplete] = useState("false")

        for(let i = 0; i < item.cart.length; i++){
            let price = item.cart[i].price.trim().replace(/[Rr]/g, '');
            totalPrice += parseFloat(price)
        }


        if(item.received){
            setComplete("true")
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
                            <TouchableOpacity onPress={() => navigation.navigate("Status", { orderID }) //navigate to a myOrders page
                            }>
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
                                            Order
                                        </Text>
                                        <Text style={styles.subText}>
                                            Delivery person: {item.delivererName}
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
                                            Meet up point: {item.location}
                                        </Text>
                                        <Text style={styles.subText}>
                                            Order Placed: {item.timePlaced.toDate().toLocaleString('en-US', options )}
                                        </Text>
                                        <Text style={styles.subText}>
                                            Pin: {item.pin}
                                        </Text>
                                        <Text style={styles.subText}>
                                            Status: {item.status}
                                        </Text>
                                        <Text style={styles.subText}>
                                            Order Complete: {item.delivered.toString()}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
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
                    <Text style={styles.heading}>Track Orders</Text>
                </View>
                <View>
                    {isOrdersLoading ? (
                        <ActivityIndicator
                            size="large"
                            color="orange"
                            style={{
                                marginTop: height * 0.2,
                                marginBottom: height * 0.2,
                            }}
                        />
                    ) : (
                        <FlatList
                            data={sortedFilteredOrders}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => <LogCard item={item} />}
                        />
                    )}
                </View>
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
        flexDirection: "column"
    },
    boldText: {
        fontFamily: "Urbanist-Bold",
    },
    header: {
        flexDirection: "row",
        paddingTop: height * 0.02,
        marginHorizontal: width * 0.05,
        position: "relative",
    },
    backButton: {
        marginRight: 10,
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

export default TrackOrdersScreen;