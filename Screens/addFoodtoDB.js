import React, { useState } from "react";
import {View, Text, TextInput, ScrollView, Button, StyleSheet, Dimensions, SafeAreaView} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, getFirestore, doc, setDoc } from 'firebase/firestore';
const { width, height } = Dimensions.get('window');


const MyForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [restaurant, setRestaurant] = useState("Deli Delicious");
    const [imgUrl, setImgUrl] = useState("");
    const [numberSubtype, setNumberSubtype] = useState(1);
    const [price, setPrice] = useState("");
    const [subtype1, setSubtype1] = useState("");
    const [price1, setPrice1] = useState("");
    const [subtype2, setSubtype2] = useState("");
    const [price2, setPrice2] = useState("");
    const [subtype3, setSubtype3] = useState("");
    const [price3, setPrice3] = useState("");
    const [foodCategory, setFoodCategory] = useState("");
    const db = getFirestore();

    const resetFormFields = () => {
        setName("");
        setDescription("");
        setRestaurant("");
        setImgUrl("");
        setNumberSubtype(1);
        setSubtype1("");
        setPrice1("");
        setSubtype2("");
        setPrice2("");
        setFoodCategory("");
    };

    const validateForm = () => {
        if (
            name.trim() === "" ||
            description.trim() === "" ||
            restaurant.trim() === "" ||
            // imgUrl.trim() === "" ||
            (numberSubtype === 1 && price === "" ) ||
            (numberSubtype > 1 &&
                (subtype1.trim() === "" || price1.trim() === ""  || subtype2.trim() === "" || price2.trim() === "" )) ||
            (numberSubtype > 2 &&
                (subtype3.trim() === "" || price3.trim() === ""))
        ) {
            return false; // At least one field is empty
        }
        return true; // All fields are filled
    };


    const handleSubmit = async() => {
        try{
            // Validate the form
            if (!validateForm()) {
                alert("Please fill in all fields before submitting.");
                return;
            }

            var foodData;

            if(numberSubtype === 1){

                foodData = {
                    Description: description,
                    Favourited: 0,
                    Name: name,
                    Restaurant: restaurant,
                    Type: foodCategory,
                    imgurl: imgUrl,
                    NumberSubtype: numberSubtype,
                    Price: price,
                };
            }else if(numberSubtype === 2){

                foodData = {
                    Description: description,
                    Favourited: 0,
                    Name: name,
                    Restaurant: restaurant,
                    Type: foodCategory,
                    imgurl: imgUrl,
                    NumberSubtype: numberSubtype,
                    Subtype1: subtype1,
                    Subtype2: subtype2,
                    Price1: price1,
                    Price2: price2,
                };
            }else if(numberSubtype === 3){
                foodData = {
                    Description: description,
                    Favourited: 0,
                    Name: name,
                    Restaurant: restaurant,
                    Type: foodCategory,
                    imgurl: imgUrl,
                    NumberSubtype: numberSubtype,
                    Subtype1: subtype1,
                    Subtype2: subtype2,
                    Subtype3: subtype3,
                    Price1: price1,
                    Price2: price2,
                    Price3: price3,
                };
            }



            const docRef = collection(db,'Foods');


            await  addDoc(docRef, foodData);
            alert("Added");
            // Reset the form fields
            resetFormFields();


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
                        <Picker.Item label="Deli Delicious" value={"Deli Delicious"} />
                        <Picker.Item label="Jimmy's East Campus" value={"Jimmy's East Campus"} />
                        <Picker.Item label="Jimmy's West Campus" value={"Jimmy's West Campus"} />
                        <Picker.Item label="Love & Light" value={"Love & Light" } />
                        <Picker.Item label="Students Corner" value={"Students Corner"} />
                        <Picker.Item label="Zesty Lemonz" value={"Zesty Lemonz" } />
                        <Picker.Item label="Xpresso" value={"Xpresso"} />
                        <Picker.Item label="vida e caffe" value={"vida e caffe"} />
                        <Picker.Item label="Starbucks" value={"Starbucks"} />
                        <Picker.Item label="Planet Savvy" value={"Planet Savvy"} />
                        <Picker.Item label="Sausage saloon" value={"Sausage saloon" } />
                        <Picker.Item label="The Tower" value={"The Tower"} />
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
                        <Picker.Item label="1" value={1} />
                        <Picker.Item label="2" value={2} />
                        <Picker.Item label="3" value={3} />
                    </Picker>
                </View>


                {numberSubtype === 1 && (
                    <>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Price:</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={(text) => setPrice(text)}
                            />
                        </View>
                    </>
                )}

                {numberSubtype > 1 && (
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

                        {numberSubtype > 2 && (
                            <>


                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Subtype 3:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={subtype3}
                                        onChangeText={(text) => setSubtype3(text)}
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Price 3:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={price3}
                                        onChangeText={(text) => setPrice3(text)}
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


