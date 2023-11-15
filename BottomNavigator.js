import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from "../Campus-Eats/Screens/Home";
import SignUpScreen from "./Screens/SignUp";
import LoginScreen from "./Screens/Login";
import RestaurantsScreen from "./Screens/Restaurants";
import ProfileScreen from './Screens/Profile';
import FormPage from "./Screens/addFoodtoDB";
import CartScreen from "./Screens/Cart";
import NotificationsScreen from "./Screens/Notifications";
import MapScreen from "./Screens/Map";
import CreditScreen from "./Screens/CreditWallet";

const Tab = createBottomTabNavigator();
const BottomNavigator = () => {
    return <Tab.Navigator screenOptions={{
        style: {
            height: 55,
            borderTopWidth: 0,
            elevation: 0,
        },
        headerShown: false, tabBarActiveTintColor: 'black' }} >
        <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarIcon: ({color}) => (
                <Icon name="home-filled" color={color} size={28}/>
            ),
        }}/>

        <Tab.Screen name="Restaurants" component={RestaurantsScreen} options={{
            tabBarIcon: ({color}) => (
                <Icon name="store" color={color} size={28}/>
            ),
        }}/>
        <Tab.Screen name="FoodDB" component={FormPage} options={{
            tabBarIcon: ({color}) => (
                <Icon name="home-filled" color={color} size={28}/>
            ),
        }}/>
        <Tab.Screen name="Cart" component={CartScreen} options={{
            tabBarIcon: ({color}) => (
                <Icon name="shopping-cart" color={color} size={28}/>
            ),
        }}/>
        <Tab.Screen name="Notifications" component={NotificationsScreen} options={{
            tabBarIcon: ({color}) => (
                <Icon name="notifications" color={color} size={28}/>
            ),
        }}/>
                <Tab.Screen name="Profile" component={ProfileScreen} options={{
                    tabBarIcon: ({color}) => (
                        <Icon name="person" color={color} size={28}/>
                    ),
        }}/>
        {/*<Tab.Screen name="Credits" component={CreditScreen} options={{*/}
        {/*    tabBarIcon: ({color}) => (*/}
        {/*        <Icon name="home-filled" color={color} size={28}/>*/}
        {/*    ),*/}
        {/*}}/>*/}
        </Tab.Navigator>
}

export default BottomNavigator;
