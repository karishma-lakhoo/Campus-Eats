import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";
import restaurants from '../consts/dummyRestaurants'

const { width, height } = Dimensions.get("window");

const RestaurantsScreen = () => {
    const [fontLoaded, setFontLoaded] = useState(false);



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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.heading]}>Restaurants</Text>
            </View>
            <View style={{ marginTop: height * 0.15 ,marginHorizontal: 10,}}>
                <FlatList
                    data={restaurants}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.itemContainer}>
                            <Image source={require('../assets/jimmys.jpg')} style={styles.itemImage} />
                            <Text style={styles.boldText}>{item.name}</Text>
                            <Text style={styles.subText}>{item.price}</Text>
                            {/*<Text style={styles.boldText}>{item.name}</Text>*/}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.flatListContainer}
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 0,
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
        position: "absolute",
    },
    boldText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 15,
        paddingBottom: 4
    },
    subText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 10,
        color: "gray"
    },
    itemContainer: {
        backgroundColor: "white",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: "column",
        alignItems: "left",
    },
    itemImage: {
        position:"relative",
        width: "100%",
        height: 150,
        marginBottom: 10,
        borderRadius: 10,

    },

    flatListContainer:{
        padding: 10
    }
});

export default RestaurantsScreen;
