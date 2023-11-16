import { useEffect, useState } from 'react';

import {collection, getFirestore, doc, getDocs, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';
import { getAuth} from "firebase/auth";

const db = getFirestore();
export async function rateDeliverer(delivererUID, rating) {
    try {
        const usersCollection = collection(db, 'users');
        const userDoc = doc(usersCollection,delivererUID);
        const ratingsCollection = collection(userDoc,'Ratings');
        const querySnapshot = await getDocs(ratingsCollection);
        let docID;
        let newRating;
        let numOfRatings;
        querySnapshot.forEach((doc) =>{
            docID = doc.id;
            const docData = doc.data();
            const currentRating = docData.rating;
            numOfRatings = docData.numOfRatings;
            numOfRatings++;
            newRating = currentRating +(rating - currentRating)/numOfRatings;
        })
        await updateDoc(doc(ratingsCollection, docID), {
            rating : newRating,
            numOfRatings : numOfRatings,
        });
    } catch (error) {
        console.log('Error getting documents', error);
        setLoading(false);
    }
}