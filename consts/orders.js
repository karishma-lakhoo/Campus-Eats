import { useEffect, useState } from 'react';

import {collection, getFirestore, addDoc, setDoc, doc, getDocs, updateDoc, arrayUnion, arrayRemove, query,where} from 'firebase/firestore';
import { getAuth} from "firebase/auth";


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
          
                    const userQuery = query(usersRef, where('__name__', '==', orderersID));
                    const userSnapshot = await getDocs(userQuery);
          
                    if (!userSnapshot.empty) {
                      const userDoc = userSnapshot.docs[0];
                      const userData = userDoc.data();
                      orderersName = userData.username;
                    }
          
                    listOfOrders.push({ id, orderersID, location, cart, orderersName });
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
                querySnapshot.forEach((doc) =>{
                    const docData = doc.data();
                    const docID = doc.id;
                    const foodItems = docData.cart;
                    const isReceived =  docData.received;
                    const deliverer = docData.deliverer;
                    const location = docData.location;
                    const status = docData.status;
                    const totalCost = docData.totalCost;
                    ordersFetched.push({docID, foodItems, isReceived, deliverer, location, status, totalCost});

                    setOrders(ordersFetched);
                    setLoading(false);
                })
            } catch (error) {
                console.log('Error getting documents', error);
                setLoading(false);
            }
        }
        getOrderData();
    }, []);
    return [orders, loading];
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
        const orderData = {
            cart: cart,
            orderersID: userUID,
            location: location,
            status: "order placed",
            deliverer: "",
            received: false,
            delivered: false,
            totalCost: tCost
        };
        const docRef = await addDoc(ordersRef, orderData);
        const orderCollection = doc(userDoc,'myOrders', docRef.id);
        await setDoc(orderCollection, orderData);
    }catch (error){
        alert(error.message);
    }


}



export async function removeOrder(){

}

