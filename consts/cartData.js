
import { useEffect, useState } from 'react';

import {collection,getFirestore, doc, getDocs} from 'firebase/firestore';
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
