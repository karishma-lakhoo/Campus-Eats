import { } from "../firebase";
import { collection, addDoc, getFirestore, doc, setDoc, getDocs, where } from 'firebase/firestore';

const db = getFirestore();
const restaurants = [];

const restaurantsRef = collection(db, 'restaurants');

const fetchData = async () => {
    try{
        const q = query(restaurantsRef);
        const querySnapshot = await getDocs(q);


        querySnapshot.forEach((doc) =>{
            const data = doc.data();
            const id = doc.id;
            const name = data.Name;
            restaurants.push({id, name});
        });
    }catch (error){
        console.log('Error getting documents', error);
    }

};

// const restaurants = [
//     {
//         key: "1",
//         name: "Jimmys",
//         price: "$$",
//         rating: '80%'
//     },
//     {
//         key: "2",
//         name: "Zesty Lemons",
//         price: "$$$",
//         rating: '30%'
//
//     },
//     {
//         key: "3",
//         name: "Sausage Saloon",
//         price: "$",
//         rating: '50%'
//
//     },
//     {
//         key: "4",
//         name: "Deli Delicious",
//         price: "$",
//         rating: '90%'
//
//     },
//
// ]

export default restaurants