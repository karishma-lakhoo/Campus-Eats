
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
                    const location = data.Location;
                    let imageURL = data.imgurl || '../assets/jimmys.jpg';

                    fetchedRestaurants.push({ id, name, imageURL, location });
                  //  console.log(`Document ID: ${id}, Name: ${name}, Location: ${location}`);
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
                    let name = data.Name;
                    const restaurantName = data.Restaurant;
                    const foodCategory = data.Type;
                    const numberSubtype = data.NumberSubtype;
                    const description = data.Description;
                    let price = data.Price;
                    const favourited = data.Favourited;
                    let imageURL = data.imgurl || '../assets/jimmys.jpg';

                   // fetchedFoods.push({ id, name, imageURL, restaurantName, foodCategory, numberSubtype, description, price, favourited });

                    if (numberSubtype === 2 ){
                        let name1   = name +  " " +  data.Subtype1;
                        let name2   = name +  " " +  data.Subtype2;
                        let price1 = data.Price1;
                        let price2 = data.Price2;
                        price = price1 + " / " + price2

                        fetchedFoods.push({ id, name, name1, name2, imageURL, restaurantName, foodCategory, numberSubtype, description,price, price1, price2, favourited });
                    }else if (numberSubtype === 3){
                        let name1   = name +  " " +  data.Subtype1;
                        let name2   = name +  " " +  data.Subtype2;
                        let name3   = name +  " " +  data.Subtype3;
                        let price1 = data.Price1;
                        let price2 = data.Price2;
                        let price3 = data.Price3;
                        price = price1 + " / " + price2 + " / " + price3;

                        fetchedFoods.push({ id,name, name1, name2, name3, imageURL, restaurantName, foodCategory, numberSubtype, description, price, price1, price2, price3, favourited });
                    }else{
                        fetchedFoods.push({ id, name, imageURL, restaurantName, foodCategory, numberSubtype, description, price, favourited });
                    }


                   // console.log(`Document ID: ${id}, Name: ${name}`);
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

    return [allFoods , isLoading];

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
