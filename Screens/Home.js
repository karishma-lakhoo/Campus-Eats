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

const { width, height } = Dimensions.get("window");

const HomeScreen = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [allFoods, isFoodLoading ] = foodList( isLoading);

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
        // Check if foodArray is defined before filtering
        if (!isLoading) {
            // When the selected category changes, filter the items based on the category type
            const selectedCategory = categories[selectedCategoryIndex];
            console.log("Selected Category:", selectedCategory.category);
            if (selectedCategory.category.toLowerCase() === "popular"){
                //implementation for showing foods with highest favourites
                console.log("pop pop");

            }else if(selectedCategory.category.toLowerCase() === "your favourites"){
                //implentation for showing logged in user's favourites
                console.log("favs");
            }else{
                const filteredItems = allFoods.filter(
                    (item) => item.foodCategory.toLowerCase() === selectedCategory.category.toLowerCase()
                );
                console.log("Filtered Items:", filteredItems);
                setSelectedItems(filteredItems);
            }

        }
    }, [ isLoading ,selectedCategoryIndex, allFoods]);


    if (!fontLoaded) {
        return null;
    }

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
                                console.log(item.key);
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
                {!allFoods ? (
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
