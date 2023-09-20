import React, { useEffect, useState } from "react";
import {Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Font from "expo-font";
import Colors from "../colors";

const { width, height } = Dimensions.get("window");

const MenuScreen = ({navigation}) => {
    const categories = [
        {
            key: "1",
            category: "Hot",
            subtypes: [
                {
                    key: "1",
                    subtype: "wings",
                },
                {
                    key: "2",
                    subtype: "Jimmy strips",
                },
                {
                    key: "3",
                    subtype: "wings",
                },
                {
                    key: "4",
                    subtype: "Jimmy strips",
                },
                {
                    key: "5",
                    subtype: "wings",
                },
                {
                    key: "6",
                    subtype: "Jimmy strips",
                },
                {
                    key: "7",
                    subtype: "wings",
                },
                {
                    key: "8",
                    subtype: "Jimmy strips",
                },
            ],
        },
        {
            key: "2",
            category: "favourites",
            subtypes: [
                {
                    key: "1",
                    subtype: "wings",
                },
                {
                    key: "2",
                    subtype: "chicken curry",
                },
            ],
        },
        {
            key: "3",
            category: "chicken",
            subtypes: [
                {
                    key: "1",
                    subtype: "wings",
                },
                {
                    key: "2",
                    subtype: "chicken curry",
                },
            ],
        },
        {
            key: "4",
            category: "beef",
            subtypes: [
                {
                    key: "1",
                    subtype: "steak",
                },
                {
                    key: "2",
                    subtype: "burger",
                },
            ],
        },
        {
            key: "5",
            category: "fish",
            subtypes: [
                {
                    key: "1",
                    subtype: "salmon",
                },
                {
                    key: "2",
                    subtype: "sushi",
                },
            ],
        },
        {
            key: "6",
            category: "vegan",
            subtypes: [
                {
                    key: "1",
                    subtype: "tofu stir-fry",
                },
                {
                    key: "2",
                    subtype: "vegetable curry",
                },
            ],
        },
        {
            key: "7",
            category: "desserts",
            subtypes: [
                {
                    key: "1",
                    subtype: "cake",
                },
                {
                    key: "2",
                    subtype: "ice cream",
                },
            ],
        },
    ];


    const [fontLoaded, setFontLoaded] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    const [selectedSubtypes, setSelectedSubtypes] = useState(categories[0].subtypes);

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


    //
    // const ListCategories = () => {
    //     return (
    //         <View style={{ marginTop: height * 0.15 ,marginHorizontal: 10,}}>
    //             <FlatList
    //                 data={categories}
    //                 horizontal
    //                 showsHorizontalScrollIndicator={false}
    //                 keyExtractor={(item) => item.key}
    //                 renderItem={({ item, index }) => (
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             setSelectedCategoryIndex(index);
    //                             setSelectedSubtypes(categories[index].subtypes); // Update selectedSubtypes here
    //                             console.log(item.key);
    //                         }}
    //                     >
    //                         <View
    //                             style={[
    //                                 styles.categoryItem,
    //                                 {
    //                                     backgroundColor:
    //                                         selectedCategoryIndex === index
    //                                             ? "#FF5733"
    //                                             : Colors.primary, // Change the colors as needed
    //                                 },
    //                             ]}
    //                         >
    //                             <Text style={styles.categoryText}>{item.category}</Text>
    //                         </View>
    //                     </TouchableOpacity>
    //                 )}
    //             />
    //         </View>
    //     );
    // };

    const ListSubtypes = () => {
        return (
            <FlatList
                style={styles.flatListContainer} // Add this style
                data={selectedSubtypes}
                numColumns={2}
                keyExtractor={(item) => item.key}
                scrollEnabled={true}
                renderItem={({ item }) => (
                    <View style={styles.subtypeItem}>
                        <Text style={styles.subtypeText}>{item.subtype}</Text>
                    </View>
                )}
                columnWrapperStyle={{
                    justifyContent: 'space-between', // Adjust the alignment as needed
                    marginVertical: 10, // Add margin between rows
                    marginHorizontal: 10, // Add margin between columns
                }}
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
                <View style={{marginTop: height*0.06}}>
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
        height: height*0.80,
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
