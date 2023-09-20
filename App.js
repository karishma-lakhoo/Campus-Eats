import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from "@react-navigation/stack";
import 'react-native-gesture-handler';
import React, { createContext, useState} from "react";
import BottomNavigator from "../Campus-Eats/BottomNavigator";
import SignUpScreen from "./Screens/SignUp";
import SplashScreen from "./Screens/Splash";
import MenuScreen from "./Screens/Menu";
import LoginScreen from "./Screens/Login";
import RestaurantsScreen from "./Screens/Restaurants";

const Stack = createStackNavigator();

export const MyContext = createContext();
export default function App() {
  const [myState, setMyState] = useState('');

  return (
      <MyContext.Provider value={{ myState, setMyState }}>
        <NavigationContainer>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <Stack.Navigator screenOptions={{headerShown: false}} initalRouteName={"SignUp"} testID="stack-navigator">
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Home" component={BottomNavigator}/>
              <Stack.Screen name="SignUp" component={SignUpScreen}/>
              <Stack.Screen name="Login" component={LoginScreen}/>
              <Stack.Screen name="Restuarants" component={RestaurantsScreen}/>
              <Stack.Screen name="Menu" component={MenuScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
  );
}
