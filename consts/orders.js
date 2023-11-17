import { useEffect, useState } from 'react';

import {collection, getFirestore, addDoc, setDoc, doc, getDocs,getDoc, updateDoc, arrayUnion, arrayRemove, query,where, serverTimestamp} from 'firebase/firestore';
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
                    let delivererName = "";
                    const delivered = data.delivered;
                    let orderersEmail = "";
                    let delivererEmail = "";
                    const timePlaced = data.timestamp;
                    const status = data.status;
                    const received = data.received;
                    const finalCost = data.totalCost;
                    const userQuery = query(usersRef, where('__name__', '==', orderersID));

                    const userSnapshot = await getDocs(userQuery);

                    const pin = data.pin;
                    if (!userSnapshot.empty) {
                        const userDoc = userSnapshot.docs[0];
                        const userData = userDoc.data();
                        orderersName = userData.username;
                        orderersEmail = userData.email;
                    }
                    if(deliverer){
                        const userQuery2 = query(usersRef, where('__name__', '==', deliverer));
                        const userSnapshot2 = await getDocs(userQuery2);
                        const userDoc2 = userSnapshot2.docs[0];
                        const userData2 = userDoc2.data();
                        delivererName = userData2.username;
                        delivererEmail = userData2.username;
                    }
          
                    listOfOrders.push({ id, orderersID, location, cart, orderersName, timePlaced, pin, delivererName, finalCost, status, received, delivered, orderersEmail, delivererEmail });
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
                for (const myDoc of querySnapshot.docs) {
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
                    ordersFetched.push({docID, foodItems, isReceived, deliverer, location, status, totalCost, timePlaced, pin});

                }
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
   // console.log(cart);
    const east = [ "Planet Savvy",  "Starbucks"];
    const west = ["Jimmy's West Campus", "The Tower", "Olives and Plates", "vida e caffe", "Zesty Lemonz"];
    const matrix = ["Chinese Latern", "Deli Delicious", "Jimmy's East Campus", "Love & Light", "Planet Savvy", "Sausage saloon", "Starbucks", "Xpresso"];
     const res = cart[0].restaurantName;
     let loc;
     if(east.includes(res)){
         loc = east;
     } else if (west.includes(res)) {
         loc = west;
     } else if (matrix.includes(res)) {
         loc = matrix;
     }

     let isValid = true;

             for (let i = 1; i < cart.length; i++) {
                 let r = cart[i].restaurantName;

                 if (!loc.includes(r)) {
                     isValid = false;
                     break;
                 }
             }

     return isValid;
}

export async function addNewOrder(cart, location, tCost){
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
        // Retrieve user credits
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const userCredits = userData.credits || 0;

        if (userCredits >= tCost) {
            // Deduct credits
            const updatedCredits = userCredits - tCost;
            await updateDoc(userDoc, {credits: updatedCredits});


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
            const orderCollection = doc(userDoc, 'myOrders', docRef.id);
            await setDoc(orderCollection, orderData);
            return docRef.id;
        }else{
            // Not enough credits
            alert("Not enough credits! Add credits in profile");
            return null;
        }

    }catch (error){
        alert(error.message);
        return null;
    }

}

export async function acceptOrder(item, callback){
    const ordersRef = collection(db, 'orders');
    const orderID = item.id;
    const orderDoc = doc(ordersRef, orderID);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    let userUID;

    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }
    if(item.status !== "Accepted"){
        try{
            await updateDoc(orderDoc, {status: "Accepted", deliverer: userUID});
            item.status = "Accepted";
            item.deliverer = userUID;
            // alert("Order accepted. Please enter pin on delivery");
            if(callback){
                callback();
            }

        }catch (error) {
            console.error('Error updating accepted order', error);
        }
    }else{
        alert("Order already accepted");
    }


}

export async function completeOrder(item, callback){

    const ordersRef = collection(db, 'orders');
    const orderID = item.id;
    const orderDoc = doc(ordersRef, orderID);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    let userUID;

    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }


    try{
        const userDocRef = doc(db, 'users', userUID);
        const userDoc = await getDoc(userDocRef);
        const currentCredits = userDoc.data().credits || 0;
        const newCredits = currentCredits + item.finalCost;
        // Update the credits field in the user's document
        await updateDoc(userDocRef, {
            credits: newCredits,
        });

        await updateDoc(orderDoc, {status: "Completed", delivered: true});
        item.status = "Completed";
        item.delivered = true;

       alert('Order completed. Your account has been credited');
       if (callback){
           callback();
       }

    }catch (error) {
        console.error('Error updating accepted order', error);
    }
}


//TODO: use this for declined orders?
export async function removeOrder(){

}



