import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import { useRecoilState, useSetRecoilState } from 'recoil';

import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import Chat from '@pages/Chat';
import Home from '@pages/Home';
import Manage from '@pages/Manage';
import Mypage from '@pages/Mypage';

import { userState, userAccessToken, userFcmToken } from '@src/states';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);
  const setFcmToken = useSetRecoilState(userFcmToken);

  const isLoggedIn = !!userInfo.userId;

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const getPushPermissions = async () => {
      let authorized;
      const enabled = await messaging().hasPermission();

      if (!enabled) {
        authorized = await messaging().requestPermission();
      }

      if (enabled || authorized) {
        const token = await messaging().getToken();
        setFcmToken(token);
      }
    };

    getPushPermissions();
  }, []);

  useEffect(() => {
    // 로그인 시 refresh token으로 accessToken을 발급하는 코드
    const getTokenAndRefresh = async () => {
      try {
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (!refreshToken) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/auth/refresh`,
          { refreshToken },
        );
        setAccessToken(response.data.data.accessToken);
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.data.refreshToken,
        );

        const userResponseData = await axios.get(
          `${Config.API_URL}/user/info`,
          {
            headers: {
              Authorization: `Bearer ${response.data.data.accessToken}`,
            },
          },
        );
        setUserInfo(userResponseData.data.data);
      } catch (error) {
        console.error(error);
        // if (error.response?.data.code === 'expired') {
        //   Alert.alert('알림', '다시 로그인 해주세요.');
        // }
      }
    };

    getTokenAndRefresh();
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
            const response = await axios.post(
              `${Config.API_URL}/auth/refresh`,
              { refreshToken },
            );
            setAccessToken(response.data.data.accessToken);
            await EncryptedStorage.setItem(
              'refreshToken',
              response.data.data.refreshToken,
            );
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
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
        <Stack.Navigator initialRouteName='SignIn'>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              headerShown: false,
              title: '로그인',
            }}
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

export default AppInner;
