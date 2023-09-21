import React, { useEffect, useState } from "react";
import { } from "../firebase";
import {collection, addDoc, getFirestore, doc, setDoc, getDocs, where, query} from 'firebase/firestore';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, Button, ScrollView
} from "react-native";
import * as Font from "expo-font";
//import restaurants from '../consts/dummyRestaurants'
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const db = getFirestore();
//const restaurants = [];

const restaurantsRef = collection(db, 'restaurants');



const RestaurantsScreen = ({navigation}) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [restaurants, setRestaurants] = useState([]); // Use state for restaurants

    useEffect(() => {
        async  function fetchData(){
            try{
                const q = query(restaurantsRef);
                const querySnapshot = await getDocs(q);

                const fetchedRestaurants = []; // Create a new array for fetched data

                querySnapshot.forEach((doc) =>{
                    const data = doc.data();
                    const id = doc.id;
                    const name = data.Name;
                    let imageURL = data.imgurl;
                    if(imageURL === undefined){
                        imageURL = '../assets/jimmys.jpg';
                    }

                    fetchedRestaurants.push({id, name, imageURL});
                    console.log(`Document ID: ${id}, Name: ${name}`); //Check if data is collected from firebase
                });

                // Update the state with fetched data
                setRestaurants(fetchedRestaurants);
                console.log("Fetched restaurants:", fetchedRestaurants);
            }catch (error){
                console.log('Error getting documents', error);
            }
        }
        fetchData();

    }, []);

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
        // Filter the restaurants based on the search text
        const filtered = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredRestaurants(filtered);
    }, [searchText]);

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const handleFilterPress = () => {
        // Add your filter logic here
    };


    const handleRestaurantPress = () => {
        // Add your filter logic here
        navigation.navigate('Menu')
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Restaurants</Text>
                </View>

                <View style={{ marginHorizontal: 10}}>
                    <View style={styles.searchContainer}>
                        <Image
                            source={require('../assets/Search.png')}
                            style={{ width: 24, height: 24 }}
                            // onPress={() => {handleFilterPress()}}
                        />

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={searchText}
                            onChangeText={handleSearchTextChange}
                        />
                        <View style={styles.filter}>
                            <TouchableOpacity onPress={() => { handleFilterPress() }} style={styles.filter}>
                                <Image
                                    source={require('../assets/Filter.png')}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList
                        data={filteredRestaurants}
                        keyExtractor={item => item.id}
                        scrollEnabled={true}
                        style={styles.flatListContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => { handleRestaurantPress() }} style={styles.itemContainer}>
                                {item.imageURL.startsWith('../assets/') ? (
                                    // Render a local image
                                    <Image source={require('../assets/jimmys.jpg')} style={styles.itemImage} />
                                ) : (
                                    // Render a remote image
                                    <Image source={{ uri: item.imageURL }} style={styles.itemImage} />
                                )}
                                <Text style={styles.boldText}>{item.name}</Text>
                                {/*<Text style={styles.boldText}>{item.name}</Text>*/}
                            </TouchableOpacity>
                        )}
                    />
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
        flexDirection: "column",
        paddingTop: height * 0.02,
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
        height: height*0.70,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10
    },
    searchInput: {
        flex: 1,
        borderColor: "gray",
        marginRight: 10,
        padding: 5,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: height*0.07,
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10
    },
    search: {
        position: "absolute"
    }
});

export default RestaurantsScreen;
