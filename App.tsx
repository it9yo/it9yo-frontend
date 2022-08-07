import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import SignUp from './src/pages/SignUp';
import SignIn from './src/pages/SignIn';
import Home from './src/pages/Home';
import Manage from './src/pages/Manage';
import Chat from './src/pages/Chat';
import Mypage from './src/pages/Mypage';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator initialRouteName='Home'>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Manage"
            component={Manage}
            options={{ headerShown: false }}
            />
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Mypage"
            component={Mypage}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName='SignUp'>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
