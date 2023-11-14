import { useEffect, useState } from 'react';

import {collection, getFirestore, addDoc, setDoc, doc, getDocs, updateDoc, arrayUnion, arrayRemove, query,where, serverTimestamp} from 'firebase/firestore';
import { getAuth} from "firebase/auth";
import {useFetchRestaurants} from "./foodData";


const db = getFirestore();

const ordersRef = collection(db, 'orders');
const usersRef = collection(db, 'users');

export function getAllOrders(){
    const [loading, setLoading] = useState(true);
    const [allOrders, setOrders] = useState([]);

    useEffect(() => {
        async function getOrdersData() {
            try {
                const q = query(ordersRef);
                const querySnapshot = await getDocs(q);

                const listOfOrders = [];

                for (const myDoc of querySnapshot.docs) {
                    const id = myDoc.id; // Firestore document ID
                    const data = myDoc.data();
                    const orderersID = data.orderersID;
                    const location = data.location;
                    const cart = data.cart;
                    let orderersName = "";
                    const deliverer = data.deliverer;
                    const timePlaced = data.timestamp;
                    const userQuery = query(usersRef, where('__name__', '==', orderersID));
                    const userSnapshot = await getDocs(userQuery);
                    const pin = data.pin;
                    if (!userSnapshot.empty) {
                      const userDoc = userSnapshot.docs[0];
                      const userData = userDoc.data();
                      orderersName = userData.username;
                    }
          
                    listOfOrders.push({ id, orderersID, location, cart, orderersName, timePlaced, pin, deliverer });
                  }


                
                setOrders(listOfOrders);
                setLoading(false);
            } catch (error) {
                console.log('Error getting documents', error);
                setLoading(false);
            }
        }
        getOrdersData();
    }, []);
    return [allOrders, loading];
}

export async function getCurrentUsersOrders(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const currentUser = auth.currentUser;
    let userUID;

    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }
    useEffect(() => {
        async function getOrderData() {
            try {
                const usersCollection = collection(db, 'users');
                const userDoc = doc(usersCollection,userUID);
                const orderCollection = collection(userDoc,'myOrders');
                const querySnapshot = await getDocs(orderCollection);
                const ordersFetched = [];
                console.log("1. here");
                querySnapshot.forEach((doc) =>{
                   console.log("witihn loop");
                    const docData = doc.data();
                    const docID = doc.id;
                    const foodItems = docData.cart;
                    const isReceived =  docData.received;
                    const deliverer = docData.deliverer;
                    const location = docData.location;
                    const status = docData.status;
                    const totalCost = docData.totalCost;
                    const timePlaced = docData.timestamp;
                    const pin = docData.pin;
                    //TODO: If order is older than two hours, delete it
                    ordersFetched.push({docID, foodItems, isReceived, deliverer, location, status, totalCost, timePlaced, pin});

                })
                console.log("After the for loop");
                setOrders(ordersFetched);
                setLoading(false);
            } catch (error) {
                console.log('Error getting documents', error);
                setLoading(false);
            }
        }
        getOrderData();
    }, []);
    return [orders, loading];
}

// Function to generate a random 4-digit code
function generateRandomPin() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
}

export function CheckCartValidity(cart) {
    console.log("Inner");
    const res = cart[0].restaurantName;
    const [isLoading, setIsLoading] = useState(true);
    let isValid = true;
    const { rests} = useFetchRestaurants(isLoading);
    console.log("I think its you above");
        if (!isLoading) {
            const restaurantWithSameName = rests.find(restaurant => restaurant.name === res);
            let mainLoc = restaurantWithSameName.Location;
            for (let i = 1; i < cart.length; i++) {
                let r = cart[i].restaurantName;
                let restWSN = rests.find(restaurant => restaurant.name === r);
                if (restWSN.Location !== mainLoc) {
                    isValid = false;
                    break;
                }
            }
        }
    return isValid;
}

export async function addNewOrder(cart, location, tCost){
    //TODO: Change to work with credits

    const auth = getAuth();
    const currentUser = auth.currentUser;
    let userUID;

    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }
    const usersCollection = collection(db, 'users');
    const userDoc = doc(usersCollection,userUID);

    try{
        const pin = generateRandomPin();
        const orderData = {
            cart: cart,
            orderersID: userUID,
            location: location,
            status: "order placed",
            deliverer: "",
            received: false,
            delivered: false,
            totalCost: tCost,
            timestamp: serverTimestamp(),
            pin: pin

        };
        const docRef = await addDoc(ordersRef, orderData);
        const orderCollection = doc(userDoc,'myOrders', docRef.id);
        await setDoc(orderCollection, orderData);
        return  docRef.id;

    }catch (error){
        alert(error.message);
        return null;
    }

}


//TODO: use this for declined orders?
export async function removeOrder(){

}

