import { useEffect, useState } from 'react';

import {collection, getFirestore, addDoc, setDoc, doc, getDocs, updateDoc, arrayUnion, arrayRemove, query} from 'firebase/firestore';
import { getAuth} from "firebase/auth";


const db = getFirestore();

const ordersRef = collection(db, 'orders');

export function getOrders(){
    const [loading, setLoading] = useState(true);
    const [allOrders, setOrders] = useState([]);

    useEffect(() => {
        async function getOrdersData() {
            try {
                const q = query(ordersRef);
                const querySnapshot = await getDocs(q);

                const listOfOrders = [];


                querySnapshot.forEach((doc) =>{
                    const data = doc.data();
                    const id = doc.id;
                    const orderersID = data.reqID;
                    //const reqName = ;
                    const location = data.meetPoint;
                    const cart = data.cart;

                    listOfOrders.push({id, orderersID, location, cart});
                })
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

export async function addNewOrder(cart, location){
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
            delivered: false
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

