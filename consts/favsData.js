import { useEffect, useState } from 'react';

import {collection,getFirestore, doc, getDocs, addDoc, updateDoc, arrayUnion, deleteDoc, arrayRemove} from 'firebase/firestore';
import { getAuth} from "firebase/auth";



export function getFavs() {
    const [foodIDs, setFoodIDs] = useState([]);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
 //   console.log("first");
   // console.log(currentUser);

    useEffect(() => {

        if (!currentUser) {
            console.log("User not logged in! 2");
            return;
        }

            async function getFavsData() {
                try {
                    const userUID = currentUser.uid;
                    const usersCollection = collection(db, 'users');
                    const userDoc = doc(usersCollection, userUID);
                    const favsCollection = collection(userDoc, 'Favourites');
                    const querySnapshot = await getDocs(favsCollection);

                    const foodIDList = [];
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        foodIDList.push(...docData.foodIDs);
                    });

                    setFoodIDs(foodIDList);
                 //   console.log('foodIDs:', foodIDList); // Log the foodIDs when set
                  //  console.log(foodIDs);
                    setLoading(false);
                } catch (error) {
                    console.log('Error getting documents', error);
                    setLoading(false);
                }
            }

            getFavsData();

    }, [currentUser]);

    return [foodIDs, loading];
}

export async function addToFavs(foodID) {


    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
  //  console.log("second");
  //  console.log(currentUser);

    if (!currentUser) {
        console.log("User not logged in! 3");
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
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.log("User not logged in! 1");
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
