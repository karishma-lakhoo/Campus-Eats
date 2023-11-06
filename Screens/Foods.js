import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Button} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";
import colors from "../colors";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {useRoute} from "@react-navigation/native";
import { addToCart } from "../consts/cartData";
import { getFirestore} from 'firebase/firestore';
import { getAuth} from "firebase/auth";
import {addToFavs, getFavs, removeFromFavs} from "../consts/favsData";
import HomeScreen from "./Home";


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
    const [cartClicked, setCartClicked] = useState(false); // Track if "Add to Cart" is clicked


    useEffect(() => {
        if(!favsLoading){

            if (favFoods.includes(foodItem.id)) {
                setLiked(true);
            } else {
                setLiked(false);
            }

        }
    }, [foodItem.id, favsLoading, favFoods]);



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

    const handleAddToCart = () => {
        // if( foodItem.numberSubtype > 1){
        //     // pop up picket to select the type
        // }
        addToCart(foodItem.id);
        setCartClicked(true);

    };
        const LikeButton = () => {
        return (
            <TouchableOpacity onPress={() => handleLikeButton()}>
                <MaterialCommunityIcons
                    style={{ marginLeft: (width * 0.35)-10, marginTop: height * 0.002 }}
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
            <View style={{flexDirection: "row", alignItems: "center", marginTop: 90 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Image
                            source={require("../assets/back_thick.png")}
                            style={{width: 24, height: 24}}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.heading, styles.boldText]}>{foodItem.name}</Text>
                </View>
                <View ><LikeButton /></View>
            </View>


            <View style={{marginTop: 50, marginHorizontal: 10, height: "22%" }}>
                <Image source={{ uri: foodItem.imageURL }} style={styles.foodImage} />
                <Text style={styles.boldText}>Price: R{foodItem.price}</Text>
                <Text style={styles.subDescr}>Description: {foodItem.description}</Text>
                <TouchableOpacity
                    style={styles.addToCart}
                    title="Add to cart"

                    onPress={() => {
                        console.log("Food item : ", foodItem.id);
                        handleAddToCart();
                        alert("Item Added to cart");

                    }}
                >
                    <Text style={styles.boldText}>Add to cart</Text>
                </TouchableOpacity>
                {cartClicked && (
                    <TouchableOpacity
                        style={styles.viewCart}
                        title="View Cart"
                        onPress={() => {
                            //handleAddToCart();
                            navigation.navigate('Cart');
                        }}
                    >
                        <Text style={styles.boldText}>View Cart</Text>

                    </TouchableOpacity>
                )}

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
    boldText: {
        fontFamily: "Urbanist-Bold",
    },
    header: {
        flexDirection: "row",
        alignItems:'center',
        width: width*0.5,
        marginLeft: 10
    },
    subText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 10,
        color: "gray"
    },
    backButton: {
        marginRight: 10,
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
    viewCart: {
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
