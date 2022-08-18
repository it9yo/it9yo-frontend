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

import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import SignUp from './src/pages/SignUp';
import SignIn from './src/pages/SignIn';
import Home from './src/pages/Home';
import Manage from './src/pages/Manage';
import Chat from './src/pages/Chat';
import Mypage from './src/pages/Mypage';
import Certification from './src/pages/Certification';
// import CertificationResult from './src/pages/CertificationResult';
import Location from './src/pages/Location';
import LocationCertification from './src/pages/LocationCertification';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    // accessToken 만료 시 refreshToken으로 accessToken을 재발급 하는 code
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const {
          config,
          response: { status },
        } = error;
        if (status === 406) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            // token refresh 요청
            const { data } = await axios.post(
              `${Config.API_URL}/user/auth/refresh`,
              { refreshToken },
            );
            // TODO: accessToken recoil 에 저장
            // data.accessToken
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
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
        <Stack.Navigator initialRouteName='Location'>
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
          <Stack.Screen
            name="Certification"
            component={Certification}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="CertificationResult"
            component={CertificationResult}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="Location"
            component={Location}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LocationCertification"
            component={LocationCertification}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
