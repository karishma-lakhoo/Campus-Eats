import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList, Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";
import { } from "../firebase";
import {foodList} from "../consts/foodData";
import categories from "../consts/foodCategories";
import {getFavs} from "../consts/favsData";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({navigation}) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [allFoods, isFoodLoading ] = foodList();
  //  console.log("favFoods runs");
    const [favFoods, favsLoading] = getFavs();
 //   console.log("favFoods:", favFoods);

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
        // Check if foodArray is defined before filtering
        if (!isFoodLoading ) {
            // When the selected category changes, filter the items based on the category type
            const selectedCategory = categories[selectedCategoryIndex];
            if (selectedCategory.category.toLowerCase() === "popular") {
                // Implementation for showing foods with highest favorites
                const randomFoods = getRandomFoods(allFoods, 10);
                setSelectedItems(randomFoods);
            } else if (selectedCategory.category.toLowerCase() === "your favourites") {

                if ( !favsLoading) {
                    const filteredFoods = allFoods.filter((food) => favFoods.includes(food.id));
                    setSelectedItems(filteredFoods);
            //        console.log("favFoods:", favFoods);
             //       console.log("selectedItems:", selectedItems);
                } else {
                    // Handle the case when favFoods is not loaded yet or is empty
                    setSelectedItems([]);
                }
            } else {
                const filteredItems = allFoods.filter(
                    (item) => item.foodCategory.toLowerCase() === selectedCategory.category.toLowerCase()
                );
                setSelectedItems(filteredItems);
            }
        }
    }, [isFoodLoading, favsLoading, selectedCategoryIndex, allFoods, favFoods]);



    if (!fontLoaded) {
        return null;
    }

    const getRandomFoods = (foodList, count) => {
        const randomFoods = [];
        const shuffledFoodList = [...foodList]; // Create a copy of the foodList to shuffle
        let currentIndex = shuffledFoodList.length;
        let temporaryValue, randomIndex;

        // Shuffle the array to get a random order
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = shuffledFoodList[currentIndex];
            shuffledFoodList[currentIndex] = shuffledFoodList[randomIndex];
            shuffledFoodList[randomIndex] = temporaryValue;
        }

        // Get the first 'count' items from the shuffled list
        for (let i = 0; i < count; i++) {
            randomFoods.push(shuffledFoodList[i]);
        }

        return randomFoods;
    };

    const ListCategories = () => {
        return (
            <View style={{ marginTop: height * 0.15 ,marginHorizontal: 10,}}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedCategoryIndex(index);
                              //  setSelectedSubtypes(categories[index].subtypes); // Update selectedSubtypes here
                          //      console.log(item.key);
                            }}
                        >
                            <View
                                style={[
                                    styles.categoryItem,
                                    {
                                        backgroundColor:
                                            selectedCategoryIndex === index
                                                ? "#FF5733"
                                                : Colors.primary, // Change the colors as needed
                                    },
                                ]}
                            >
                                <Text style={styles.categoryText}>{item.category}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

    const ListItem = ({ item }) => {
        // Render individual food items here
        return (
            <View style={styles.subtypeItem}>
                <Text style={styles.subtypeText}>{item.Name}</Text>
            </View>
        );
    }

    const ListSubtypes = () => {
      const   numColumns= 2;
      const   columnWidth = (width - 30) / numColumns ;
        const itemHeight = height * 0.2;
        return (

            <FlatList
                style={styles.flatListContainer} // Add this style
                data={selectedItems}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}

                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {handleFoodPress(item)}} style={styles.itemContainer}>
                        {item.imageURL.startsWith('../assets/') ? (
                            <Image source={require('../assets/jimmys.jpg')} style={[styles.itemImage, {width: columnWidth, height: itemHeight}]} />
                        ) : (
                            <Image source={{ uri: item.imageURL }} style={[styles.itemImage, {width: columnWidth, height: itemHeight}]} />
                        )}
                        <Text style={styles.boldText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                columnWrapperStyle={{
                    justifyContent: 'space-between', // Adjust the alignment as needed
                    marginVertical: 40, // Add margin between rows
                    marginHorizontal: 10, // Add margin between columns
                }}
            />
        );
    };

    const handleFoodPress = (foodItem) => {
        navigation.navigate('Foods', {foodItem});
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.heading, styles.boldText]}>Home</Text>
            </View>
            <View>
                <ListCategories />
            </View>
            <View>
                {isFoodLoading || (selectedCategoryIndex === categories.findIndex(cat => cat.category.toLowerCase() === 'your favourites') && favsLoading)  ? (
                    <ActivityIndicator size="large" color="orange" style={{ marginTop: (height/2) - height*0.15 }} />
                ) : (
                    <ListSubtypes />
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
    heading: {
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
    },
    categoryItem: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 10,
        height: height * 0.07,
        width: width * 0.21,
        justifyContent: "center",
        alignItems: "center",


    },
    categoryText: {
        fontFamily: "Urbanist-Regular",
        color: "#FFF",
        fontWeight: "bold"
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
        height: height*0.74,
        padding: 10
    }
});

export default HomeScreen;
