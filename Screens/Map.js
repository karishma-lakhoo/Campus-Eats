import React, { useEffect, useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TouchableWithoutFeedback, FlatList, Button, ScrollView, Pressable, TextInput, Modal, ActivityIndicator
} from "react-native";
import * as Font from "expo-font";
import SelectBox from 'react-native-multi-selectbox'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import foodCategories from "../consts/foodCategories";
import { Animated } from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";

const { width, height } = Dimensions.get("window");

const MapScreen = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);
    const map = React.useRef(null); // Use mapRef instead of this.map

    const options = [
        {
            item: 'Chamber of mines',
            id: '0',
            coordinate: {
                latitude: -26.191417404967527,
                longitude:  28.0270147972487,
            },
            image: "../assets/profile.jpg",
            location: "West Campus"
        },

        {
            item: 'Solomon Mahlangu House',
            id: '1',
            coordinate: {
                latitude: -26.192953158356087,
                longitude: 28.03078356356788,
            },
            image: "../assets/profile.jpg",
            location: "East Campus"
        },
        {
            item: 'Library Lawns',
            id: '2',
            coordinate: {
                latitude: -26.190621267281905,
                longitude: 28.030315002576547,
            },
            image: "../assets/profile.jpg",
            location: "East Campus"
        },
        {
            item: 'Law Lawns',
            id: '3',
            coordinate: {
                latitude: -26.187739569419605,
                longitude:  28.0253896027605,
            },
            image: "../assets/profile.jpg",
            location: "West Campus"
        },
        {
            item: 'Science Stadium',
            id: '4',
            coordinate: {
                latitude: -26.190680274339,
                longitude: 28.025609301102797,
            },
            image: "../assets/profile.jpg",
            location: "West Campus"
        },

    ];
    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    useEffect(() => {
        mapAnimation.addListener(({ value }) => {
            let index = Math.floor(value / width * 0.8 + 0.3); // animate 30% away from landing on the next item
            if (index >= options.length) {
                index = options.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(regionTimeout);

            const regionTimeout = setTimeout(() => {
                if( mapIndex !== index ) {
                    mapIndex = index;
                    console.log(mapIndex)
                    const { coordinate } = options[index+1];
                    map.current.animateToRegion(
                        {
                            ...coordinate,
                            latitudeDelta: 0.009,
                            longitudeDelta: 0.009,
                        },
                        350
                    );
                }
            }, 10);
        });
    });



    const [selectedOption, setSelectedOption] = useState(options[0]);
    const onMarkerPress = (mapEventData) => {
        console.log("asdf")
    }
    const handleSelect = (option) => {
        setSelectedOption(option);
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
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Image
                            source={require("../assets/back_thick.png")}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Choose Pickup Spot</Text>
                </View>

                <View style={{ marginHorizontal: 10 }}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity style={styles.locationButton}
                                          onPress={() => {
                                              console.log("loc")
                                          }}>
                            <Image
                                source={require('../assets/placeholder.png')}
                                style={{ width: 33, height: 33 }}
                            />
                        </TouchableOpacity>
                        <View style={{ width: "80%"}}>
                            <SelectBox
                                label="Location"
                                options={options}
                                value={selectedOption}
                                arrowIconColor='orange'
                                searchIconColor='orange'
                                onChange={(value) => setSelectedOption(value)}
                            />
                        </View>
                    </View>
                </View>
                <View style={{flex:1, backgroundColor: "white"}}>
                    <MapView
                        ref={map}
                        style={{ flex: 1 }}
                        initialRegion={{
                            latitude: -26.191417404967527,
                            longitude:  28.0270147972487,
                            latitudeDelta: 0.009,
                            longitudeDelta: 0.009,
                        }}
                        provider={PROVIDER_GOOGLE}
                    >
                        {options.map((marker, id) => (
                            <Marker
                                key={id}
                                coordinate={{
                                    latitude: marker.coordinate.latitude,
                                    longitude: marker.coordinate.longitude
                                }}
                                title={marker.name}
                                identifier="origin"
                                pinColor="orange"
                                onPress={(e) => onMarkerPress(e)}
                            >
                                <Animated.View style={styles.markerWrap}>
                                    <Animated.Image
                                        source={require("../assets/placeholder.png")}
                                        style={styles.marker}
                                        resizeMode="cover"/>
                                </Animated.View>
                            </Marker>

                        ))}
                    </MapView>
                    <Animated.ScrollView
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollView}
                        pagingEnabled
                        snapToInterval={width * 0.8 + 20} // Adjust the value as needed
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: width * 0.1 - 10
                        }}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: mapAnimation
                                        }
                                    },
                                },
                            ],
                            {useNativeDriver: true}
                        )}
                    >
                        {options.map((marker, id) => (
                            <View style={styles.card} key={id}>
                                <Image
                                    source={require("../assets/profile.jpg")}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.textContent}>
                                    <Text style={styles.boldText}>{marker.item}</Text>
                                    <Text style={styles.subText}>{marker.location}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.bottomButton}
                                    onPress={() => {
                                        console.log("asdfasefasdf")
                                    }}>
                                    <Text style={styles.bottomButtonText}>Select</Text>
                                </TouchableOpacity>
                            </View>

                        ))}


                    </Animated.ScrollView>
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
        fontSize: 15,
        paddingBottom: 4
    },
    backButton: {
        marginRight: 10,
    },
    subText: {
        fontFamily: "Urbanist-Bold",
        fontSize: 13,
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
        justifyContent: "space-between",
        marginTop: height*0.07,
        marginHorizontal: 10,
        height: 100,
        padding: 10
    },
    search: {
        position: "absolute"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 200,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    option: {
        fontFamily: "Urbanist-Bold",
        fontSize: 16,
        paddingVertical: 10,
    },
    locationButton: {
        backgroundColor: 'white',
        height: 50,
        width: 50,
        borderRadius:30,
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
    },
    dropdown: {
        width: 200,
        height: 50,
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
        width:50,
        height:50,
    },
    marker: {
        width: 30,
        height: 30,
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    card: {
        // padding: 10,
        elevation: 2,
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: 200,
        width: width*0.8,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1.5,
        padding: 10,
    },

    bottomButton: {
        backgroundColor: "orange",
        width: "70%",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 20, // Add margin from the bottom
    },
    bottomButtonText: {
        color: "white",
        fontSize: 14,
        fontFamily: "Urbanist-Bold",
    },
});

export default MapScreen;
