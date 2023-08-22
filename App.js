import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from "@react-navigation/stack";
import 'react-native-gesture-handler';
import React, { createContext, useState} from "react";
import BottomNavigator from "../Campus-Eats/BottomNavigator";

const Stack = createStackNavigator();

export const MyContext = createContext();
export default function App() {
  const [myState, setMyState] = useState('');

  return (
      <MyContext.Provider value={{ myState, setMyState }}>
        <NavigationContainer>
          <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
          <Stack.Navigator screenOptions={{headerShown: true}} initalRouteName={"HomeScreen"} testID="stack-navigator">
            <Stack.Screen name="Home" component={BottomNavigator}/>
          </Stack.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
  );
}
