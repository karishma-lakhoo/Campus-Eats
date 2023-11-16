import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";
import {useRoute} from "@react-navigation/native";
import {foodList} from "../consts/foodData";
import categories from "../consts/foodCategories";


const { width, height } = Dimensions.get("window");

const MenuScreen = ({navigation}) => {
    const route = useRoute();
    const { restaurantName } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [allFoods, isFoodLoading] = foodList(isLoading);

    const [fontLoaded, setFontLoaded] = useState(false);
  //  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    const [selectedItems, setSelectedItems] = useState([]);

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

    useEffect(() => {
        // Use this useEffect to ensure setIsLoading(false) is called
        if (allFoods.length > 0) {
            setIsLoading(false);
        }
    }, [allFoods]);

    useEffect(() => {
        if(!isLoading){
            const filteredItems = allFoods.filter(
                (item) => item.restaurantName === restaurantName
            );
            setSelectedItems(filteredItems);
        }

    }, [isLoading, allFoods]);

    if (!fontLoaded) {
        return null;
    }

    const handleFoodPress = (foodItem) => {
        navigation.navigate('Foods', {foodItem});
    }


    const ListSubtypes = () => {
        const   numColumns= 2;
        const   columnWidth = (width - 80) / numColumns ;
        const itemHeight = height * 0.2;

        // Create an object to group items by category
        const itemsByCategory = {};
        selectedItems.forEach((item) => {
            const category = item.foodCategory.toUpperCase();
            if (!itemsByCategory[category]) {
                itemsByCategory[category] = [];
            }
            itemsByCategory[category].push(item);
        });

        // Convert the grouped items into an array of objects with category and items
        const categorizedItems = Object.keys(itemsByCategory).map((category) => ({
            category,
            items: itemsByCategory[category],
        }));

        return (
            <FlatList
                style={styles.flatListContainer}
                data={categorizedItems}
                keyExtractor={(item) => item.category}
                renderItem={({ item }) => (
                    <>
                        <Text style={styles.categoryHeading}>{item.category}</Text>
                        <FlatList
                            data={item.items}
                            numColumns={numColumns}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => {handleFoodPress(item)}} style={styles.itemContainer}>
                                    <View style={{marginBottom: 40}}>
                                        {item.imageURL.startsWith('../assets/') ? (
                                            <Image source={require('../assets/jimmys.jpg')} style={[styles.itemImage, {width: columnWidth, height: itemHeight , borderRadius: 10}]} />
                                        ) : (
                                            <Image source={{ uri: item.imageURL }} style={[styles.itemImage, {width: columnWidth-5, height: itemHeight , borderRadius: 10}]} />
                                        )}
                                    </View>
                                    <View style={{paddingTop: 185, position: "absolute"}}>
                                        <Text style={styles.boldText}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            columnWrapperStyle={{
                                justifyContent: 'space-between', // Adjust the alignment as needed
                                marginVertical: 15, // Add margin between rows
                                marginHorizontal: 10, // Add margin between columns
                            }}
                        />
                    </>
                )}
            />
        );
    };


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
                    <Text style={[styles.heading, styles.boldText]}>Menu</Text>
                </View>
                <View style={{marginTop: height*0.04}}>
                    <ListSubtypes/>
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

    },
    categoryHeading: {
        marginLeft: 15,
        fontFamily: "Urbanist-Bold",
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
        height: 250,
        width: 180,
        elevation: 8,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: "#FFF",
        flexDirection: 'column',
        alignItems: 'center',
    },

    subtypeItem: {
        backgroundColor: "white", // Change the colors as needed
        padding: 20,
        marginVertical: 5,
        borderRadius: 10,
        width: width*0.43,
        height: height* 0.25,
        elevation: 5
    },
    subtypeText: {
        fontFamily: "Urbanist-Regular",
        color: "black",
        fontWeight: "bold",
    },
    flatListContainer:{
        marginTop: 40,
        height: height*0.900,
        paddingLeft: 10,
        paddingRight: 10,

    },
    flatContainer:{
        flex: 1,
        marginTop: height * 0.7,
    },
    backButton: {
        marginRight: 10, // Add spacing between the back button and heading
    },
    backButtonText: {
        fontFamily: 'Urbanist-Regular',
        fontSize: 16,
        color: '#333', // Adjust the color as needed
    },
});

export default MenuScreen;
