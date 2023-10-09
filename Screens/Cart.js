import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, FlatList, Button
} from "react-native";
import * as Font from "expo-font";
import { FontAwesome5 } from '@expo/vector-icons';
import { PFPpopup } from "../PopUps/PFPpopup";
import Colors from "../colors";
import foodCategories from "../consts/foodCategories";
import { foodList } from "../consts/foodData";
import { getCart } from "../consts/cartData";

const { width, height } = Dimensions.get("window");

const CartScreen = ({ navigation }) => {
    let popupRef = React.createRef();
    const [cartList, setCartList] = useState([]);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [cartFoods, cartLoading] = getCart();
    const [allFoods, foodLoading] = foodList();


    useEffect(() =>{
        if(!foodLoading && !cartLoading ){
            const filteredFoods = allFoods.filter(food => cartFoods.includes(food.id));
            setCartList(filteredFoods);
        }
    },[cartLoading,foodLoading]);

    
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
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Image
                            source={require('../assets/back_thick.png')}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.heading, styles.boldText]}>My Cart</Text>
                </View>
                <View style={{marginTop: height*0.06}}>
                    <FlatList data={cartList}
                              keyExtractor={(item) => item.key}
                              scrollEnabled={true}
                              style={styles.flatListContainer}
                              renderItem={({ item }) => (
                                  <View style={styles.itemContainer}>
                                      <Image source={{ uri : item.imageURL } || require('../assets/jimmys.jpg')} style={styles.itemImage} />
                                      <View style={{flexDirection:"column"}}>
                                          <Text style={[styles.boldText, styles.category]}>{item.foodCategory}</Text>
                                          <Text style={[styles.boldText, styles.subcategory]}>{item.restaurantName}</Text>
                                          <Text></Text>
                                          <Text></Text>
                                          <Text style={[styles.boldText, styles.category]}>{item.price} </Text>
                                      </View>

                                      <TouchableOpacity
                                          style={styles.rightButton}
                                          onPress={() => {
                                              // navigation.goBack();
                                          }}
                                      >
                                          <Image
                                              source={require('../assets/delete.png')}
                                              style={{ width: 24, height: 24 }}
                                          />
                                      </TouchableOpacity>
                                  </View>
                                  )}
                    />
                </View>
                <TouchableOpacity style={styles.bottomButton}>
                    <Text style={styles.bottomButtonText}>Checkout</Text>
                </TouchableOpacity>
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
        marginTop: height * 0.02,
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
        height: height*0.80,
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
        backgroundColor: "orange", // Adjust button styles as needed
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60, // Adjust button height
    },
    bottomButtonText: {
        color: "white",
        fontSize: 18,
        fontFamily: "Urbanist-Bold",
    },
});

export default CartScreen;
