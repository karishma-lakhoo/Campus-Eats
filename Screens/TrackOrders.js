import {SafeAreaView, TextInput, Text, View, StyleSheet, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import {getAllOrders} from "../consts/orders";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const { width, height } = Dimensions.get("window");
const TrackOrdersScreen = ({navigation}) => {
    const [allOrders, isOrdersLoading] = getAllOrders();
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [userID, setUserID] = useState('');
    const auth = getAuth();
    const db = getFirestore();
    console.log(allOrders);
    // useEffect(() => {
    //     const filtered = allOrders.filter(item => item.orderersID === "3P6lxfR5LtX7tj6vsesSXH8cLT22");
    //     setFilteredOrders(filtered)
    //     console.log(filtered)
    //     });

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Track Orders</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}



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
        flexDirection: "column",
        paddingTop: height * 0.02,
        marginHorizontal: width * 0.05,
        position: "absolute",
    },
});

export default TrackOrdersScreen;