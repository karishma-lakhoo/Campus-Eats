import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Button} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";
import colors from "../colors";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {useRoute} from "@react-navigation/native";
import { addToCart } from "../consts/cartData";


const { width, height } = Dimensions.get("window");

const FoodsScreen = ({ navigation }) => {

    const db = getFirestore();
    const auth = getAuth();
  //  const favFoodCollectionRef = collection(docRef, 'Favourites');
    const route = useRoute();
    const foodItem = route.params.foodItem;
    const [favFoods, favsLoading] = getFavs();
    const [fontLoaded, setFontLoaded] = useState(false);
    const [liked, setLiked] = useState(false);


    useEffect(() => {
        if(!favsLoading){

            if (favFoods.includes(foodItem.id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

        }
    }, [foodItem.id, favsLoading]); // You can add favFoods to the dependency array if it's expected to change



    const handleLikeButton = () => {
        setLiked(!liked);
        if (!liked) {
            // Call the addToFavs function to add the food item to favorites
            addToFavs(foodItem.id); // Pass the food item ID or appropriate data
        }else{
            //Remove from favourites
            removeFromFavs(foodItem.id);

        }

    };

    const LikeButton = () => {
        return (
            <TouchableOpacity onPress={() => handleLikeButton()}>
                <MaterialCommunityIcons
                    style={{ marginLeft: width * 0.35, marginTop: height * 0.002 }}
                    name={liked ? "heart" : "heart-outline"}
                    size={32}
                    color={liked ? "red" : "black"}
                />
            </TouchableOpacity>
        );
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.heading]}>{foodItem.name}</Text>
                <LikeButton />
            </View>
            <View style={{ marginTop: height * 0.15, marginHorizontal: 10, height: "24%" }}>
                <Image source={{ uri: foodItem.imageURL }} style={styles.foodImage} />
                <Text style={styles.boldText}>Price: {foodItem.price}</Text>
                <Text style={styles.subDescr}>Description: {foodItem.description}</Text>
                <TouchableOpacity
                    style={styles.addToCart}
                    title="Add to cart"
                    onPress={() => {
                        console.log("Food item : ",foodItem.id);
                        addToCart(foodItem.id);
                        console.log("Added item to cart")}}
                >
                    <Text style={styles.boldText}>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: "#F2F5F9",
    },
    like: {
    },
    heading: {
        fontFamily: "Urbanist-Bold",
        fontSize: 26,
    },
    header: {
        marginTop: height * 0.07,
        flexDirection: "row",
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

    subDescr: {
        //fontFamily: "Urbanist-Bold",
        fontSize: 15,
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

    foodImage: {
        position:"relative",
        width: "100%",
        height: "600%",
        marginBottom: 10,
        borderRadius: 10,

    },

    addToCart: {
        position:"relative",
        backgroundColor: colors.primary,
        width: "100%",
        padding: 20,
        marginVertical: 6,
        alignItems:'center',
        borderRadius: 12,
    },

    flatListContainer:{
        padding: 10
    }
});

export default FoodsScreen;
