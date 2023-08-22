import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from "../Campus-Eats/Screens/Home";
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
    </Tab.Navigator>
}

export default BottomNavigator;