import { useEffect, useState } from 'react';

import {collection,getFirestore, doc, getDocs, addDoc, updateDoc, arrayUnion, deleteDoc, arrayRemove} from 'firebase/firestore';
import { getAuth} from "firebase/auth";


const db = getFirestore();
export function getFavs(){
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
        async function getFavsdata() {
            try {
                const usersCollection = collection(db, 'users');
                const userDoc = doc(usersCollection,userUID);
                const favsCollection = collection(userDoc,'Favourites');
                const querySnapshot = await getDocs(favsCollection);

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
        getFavsdata();
    }, []);
    return [foodIDs, loading];
}

export async function addToFavs(foodID) {
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
        const favsCollection = collection(userDoc, 'Favourites');
        const querySnapshot = await getDocs(favsCollection);
        if(querySnapshot.empty){
            // Add the new foodID to the "Favourites" collection
            await addDoc(favsCollection, {
                foodIDs: [foodID], // You can modify the data structure as needed
                //   timestamp: new Date(), // You can add a timestamp or other relevant data
            });
        }else{
            querySnapshot.forEach(async (document) =>{
                const docID = document.id;

                await updateDoc(doc(favsCollection, docID),{
                    foodIDs: arrayUnion(...[foodID]),
                });
            })
        }

        console.log('Data added to Favorites successfully');
    } catch (error) {
        console.error('Error adding data to Favorites', error);
    }
}

export async function removeFromFavs(foodID) {
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
        const favsCollection = collection(userDoc, 'Favourites');
        const querySnapshot = await getDocs(favsCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (document) => {
                const docID = document.id;

                // Update the existing document to remove the specified foodID
                await updateDoc(doc(favsCollection, docID), {
                    foodIDs: arrayRemove(foodID),
                });
            });
            console.log('Data removed from Favorites successfully');
        } else {
            console.log("User's favorites is empty, nothing to remove.");
        }
    } catch (error) {
        console.error('Error removing data from Favorites', error);
    }
}
