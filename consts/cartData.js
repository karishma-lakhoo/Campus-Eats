
import { useEffect, useState } from 'react';

import {collection, getFirestore, doc, getDocs, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';
import { getAuth} from "firebase/auth";


const db = getFirestore();
export function getCart(){
    const [foodIDs, setFoodIDs] = useState([]);
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
        async function getCartData() {
            try {
                const usersCollection = collection(db, 'users');
                const userDoc = doc(usersCollection,userUID);
                const cartCollection = collection(userDoc,'Cart');
                const querySnapshot = await getDocs(cartCollection);

                querySnapshot.forEach((doc) =>{
                    const docData = doc.data();
                    setFoodIDs(docData.foodIDs);
                    setLoading(false);
                })
            } catch (error) {
                console.log('Error getting documents', error);
                setLoading(false);
            }
        }
        getCartData();
    }, []);
    return [foodIDs, loading];
}

export async function addToCart(foodId){
    const auth = getAuth();
    const currentUser = auth.currentUser;
    let userUID;
    
    if(currentUser){
        userUID = currentUser.uid;
    }
    else{
        console.log("User not logged in!");
    }

    try {
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection,userUID);
        const cartCollection = collection(userDoc,'Cart');
        const querySnapshot = await getDocs(cartCollection);

        querySnapshot.forEach(async (document) => {
            const docId = document.id;
    
            await updateDoc(doc(cartCollection, docId),{
                foodIDs: arrayUnion(...[foodId]),
                });
          });
    } catch (error) {
        console.log('Error getting documents', error);
    }
}

export async function removeFromCart(foodID) {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.log("User not logged in!");
        return;
    }

    const userUID = currentUser.uid;

    try {
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, userUID);
        const cartCollection = collection(userDoc, 'Cart');
        const querySnapshot = await getDocs(cartCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (document) => {
                const docID = document.id;

                // Update the existing document to remove the specified foodID
                await updateDoc(doc(cartCollection, docID), {
                    foodIDs: arrayRemove(foodID),
                });
            });
            console.log('item removed from Cart successfully');
        } else {
            console.log("Cart is empty, nothing to remove.");
        }
    } catch (error) {
        console.error('Error removing data from Cart', error);
    }
}

export async function clearCart(){
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.log("User not logged in!");
        return;
    }

    const userUID = currentUser.uid;

    try {
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection, userUID);
        const cartCollection = collection(userDoc, 'Cart');
        const querySnapshot = await getDocs(cartCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (document) => {
                const docID = document.id;

                // Clear the entire 'foodIDs' array to remove all items
                await updateDoc(doc(cartCollection, docID), {
                    foodIDs: [],
                });
            });
            console.log('All items removed from Cart successfully');
        } else {
            console.log("Cart is empty, nothing to remove.");
        }
    } catch (error) {
        console.error('Error removing data from Cart', error);
    }


}