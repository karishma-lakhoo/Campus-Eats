
import { useEffect, useState } from 'react';

import {collection, addDoc, getFirestore, doc, setDoc, getDocs, where, query} from 'firebase/firestore';

const db = getFirestore();
const restaurantsRef = collection(db, 'restaurants');
const foodsRef = collection(db, 'Foods');

export function useFetchRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const q = query(restaurantsRef);
                const querySnapshot = await getDocs(q);

                const fetchedRestaurants = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    const name = data.Name;
                    let imageURL = data.imgurl || '../assets/jimmys.jpg';

                    fetchedRestaurants.push({ id, name, imageURL });
                    console.log(`Document ID: ${id}, Name: ${name}`);
                });

                setRestaurants(fetchedRestaurants);
                setIsLoading(false); // Set isLoading to false when data fetching is complete
            } catch (error) {
                console.log('Error getting documents', error);
                setIsLoading(false); // Handle errors by setting isLoading to false
            }
        }
        fetchData();
    }, []);

    return { restaurants, isLoading };
}

 export function foodList(){
    const [allFoods, setFoods] = useState([]);
     const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function fetchData() {
            try {
                const q = query(foodsRef);
                const querySnapshot = await getDocs(q);

                const fetchedFoods = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    const name = data.Name;
                    const restaurantName = data.Restaurant;
                    const foodCategory = data.Type;
                    const numberSubtype = data.NumberSubtype;
                    const description = data.Description;
                    const price = data.Price;
                    const favourited = data.Favourited;
                    let imageURL = data.imgurl || '../assets/jimmys.jpg';

                    fetchedFoods.push({ id, name, imageURL, restaurantName, foodCategory, numberSubtype, description, price, favourited });
                    console.log(`Document ID: ${id}, Name: ${name}`);
                });

                setFoods(fetchedFoods);
                setIsLoading(false); // Set isLoading to false when data fetching is complete
            } catch (error) {
                console.log('Error getting documents', error);
                setIsLoading(false); // Handle errors by setting isLoading to false
            }
        }
        fetchData();
    }, []);

    return { allFoods , isLoading};

}


// export function  restaurantFoodList(restaurantName){
//     const [isLoading, setIsLoading] = useState(true);
//     const [filteredFoods, setFilteredFoods] = useState([])
//
//     useEffect(() => {
//         const {allFoods} = FoodList();
//         if (allFoods.length > 0) {
//             const filtered = allFoods.filter(item => item.restaurantName === restaurantName);
//             setFilteredFoods(filtered);
//
//         }
//     }, [restaurantName]);
//     setIsLoading(false);
//
//     return { isLoading, filteredFoods };
// }
