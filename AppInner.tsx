import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

import { Alert, Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios, { AxiosError } from 'axios';

import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import { useRecoilState } from 'recoil';
import SignIn from './src/pages/SignIn';
import Home from './src/pages/Home';
import Manage from './src/pages/Manage';
import Chat from './src/pages/Chat';
import Mypage from './src/pages/Mypage';
import Location from './src/pages/Location';
import LocationCertification from './src/pages/LocationCertification';
import { userState, userAccessToken } from './src/recoil';
import Terms from './src/pages/Terms';
import AdditionalInfo from './src/pages/AdditionalInfo';
import PhoneCertification from './src/pages/PhoneCertification';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);

  const isLoggedIn = !!userInfo.phoneNumber;

  useEffect(() => {
    SplashScreen.hide();
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
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setUserInfo(userResponseData.data.data);
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        // TODO: 스플래시 스크린 없애기
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
            name="Terms"
            component={Terms}
            options={{
              title: '약관 동의',
              headerLeft: () => (
                <></>
              ),
            }}
          />
          <Stack.Screen
            name="AdditionalInfo"
            component={AdditionalInfo}
            options={{
              title: '추가 정보 입력',
              headerLeft: () => (
              <></>
              ),
            }}
          />
          <Stack.Screen
            name="PhoneCertification"
            component={PhoneCertification}
            options={{
              title: '전화 번호 인증',
              headerLeft: () => (
              <></>
              ),
            }}
          />
          <Stack.Screen
            name="Location"
            component={Location}
            options={{
              title: '지역 설정',
              headerLeft: () => (
              <></>
              ),
            }}
          />
          <Stack.Screen
            name="LocationCertification"
            component={LocationCertification}
            options={{
              title: '지역 인증',
              headerLeft: () => (
              <></>
              ),
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
