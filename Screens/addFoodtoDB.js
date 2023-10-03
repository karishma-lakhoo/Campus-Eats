import React, { useState } from "react";
import {View, Text, TextInput, ScrollView, Button, StyleSheet, Dimensions, SafeAreaView} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, getFirestore, doc, setDoc } from 'firebase/firestore';
const { width, height } = Dimensions.get('window');


const MyForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [numberSubtype, setNumberSubtype] = useState(0);
    const [subtype1, setSubtype1] = useState("");
    const [price1, setPrice1] = useState("");
    const [subtype2, setSubtype2] = useState("");
    const [price2, setPrice2] = useState("");
    const [foodCategory, setFoodCategory] = useState("");
    const db = getFirestore();

    const handleSubmit = async() => {
        try{
            const foodData = {
                Description: description,
                Favourited: 0,
                Name: name,
                Restaurant: restaurant,
                Type: foodCategory,
                imgurl: imgUrl,
                NumberSubtype: numberSubtype,
            };

            const docRef = doc(db,'Foods');
            await  setDoc(docRef, foodData);


        }catch(error){
            alert(error.message);
        }

    }

    return (

        <SafeAreaView style={styles.container}>
            <ScrollView >

                {/* Add some margin to the top */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Restaurant:</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={restaurant}
                        onValueChange={(itemValue, itemIndex) => setRestaurant(itemValue)}
                    >
                        <Picker.Item label="Chinese Latern" value={0} />
                        <Picker.Item label="Deli Delicious" value={1} />
                        <Picker.Item label="Jimmy's East Campus" value={2} />
                        <Picker.Item label="Jimmy's West Campus" value={3} />
                        <Picker.Item label="Love & Light" value={4} />
                        <Picker.Item label="Students Corner" value={5} />
                        <Picker.Item label="Zesty Lemonz" value={6} />
                        <Picker.Item label="Xpresso" value={7} />
                        <Picker.Item label="vida e caffe" value={8} />
                        <Picker.Item label="Starbucks" value={9} />
                        <Picker.Item label="Planet Savvy" value={10} />
                        <Picker.Item label="Sausage saloon" value={11} />
                        <Picker.Item label="The Tower" value={12} />
                    </Picker>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Image URL:</Text>
                    <TextInput
                        style={styles.input}
                        value={imgUrl}
                        onChangeText={(text) => setImgUrl(text)}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Number Subtype:</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={numberSubtype}
                        onValueChange={(itemValue, itemIndex) => setNumberSubtype(itemValue)}
                    >
                        <Picker.Item label="0" value={0} />
                        <Picker.Item label="1" value={1} />
                        <Picker.Item label="2" value={2} />
                        <Picker.Item label="3" value={3} />
                    </Picker>
                </View>

                {numberSubtype > 0 && (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Subtype 1:</Text>
                            <TextInput
                                style={styles.input}
                                value={subtype1}
                                onChangeText={(text) => setSubtype1(text)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Price 1:</Text>
                            <TextInput
                                style={styles.input}
                                value={price1}
                                onChangeText={(text) => setPrice1(text)}
                            />
                        </View>

                        {numberSubtype > 1 && (
                            <>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Subtype 2:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={subtype2}
                                        onChangeText={(text) => setSubtype2(text)}
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Price 2:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={price2}
                                        onChangeText={(text) => setPrice2(text)}
                                    />
                                </View>
                            </>
                        )}
                    </>
                )}

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Food Category:</Text>
                    <TextInput
                        style={styles.input}
                        value={foodCategory}
                        onChangeText={(text) => setFoodCategory(text)}
                    />
                </View>

                <Button title="Submit" onPress={handleSubmit} />
            </ScrollView>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50, // Add some padding to the top
    },
    formGroup: {
        marginBottom: 16, // Add margin between form groups
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
    },
    picker: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
    },
});

export default MyForm;


