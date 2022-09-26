import React, { useEffect } from 'react';
import { Alert, Pressable, Text } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import { useRecoilState, useSetRecoilState } from 'recoil';

import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import HomeTabs from '@pages/HomeTabs';
import ChatRoom from '@pages/Chat/ChatRoom';
import CampaignDetail from '@pages/Home/CampaignDetail';
import Search from '@pages/Home/Search';
import EditProfile from '@pages/Mypage/EditProfile';
import It9yoPay from '@pages/Mypage/It9yoPay';
import CreateCampaign from '@pages/Home/CreateCampaign';

import {
  userState, userAccessToken, userFcmToken, location,
} from '@src/states';

import HeaderBackButton from '@components/HeaderBackButton';
import HeaderCloseButton from '@components/HeaderCloseButton';

const Stack = createNativeStackNavigator();

function App() {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);
  const setFcmToken = useSetRecoilState(userFcmToken);
  const setLocation = useSetRecoilState(location);

  const isLoggedIn = !!userInfo.userId;

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

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
        setLocation({
          siDo: userResponseData.data.data.siDo,
          siGunGu: userResponseData.data.data.siGunGu,
        });
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
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            options={({ navigation }) => ({
              title: '',
              headerLeft: () => <HeaderBackButton onPress={navigation.goBack} />,
            })}
          />
          <Stack.Screen
            name="CampaignDetail"
            component={CampaignDetail}
            options={({ navigation }) => ({
              title: '',
              headerLeft: () => <HeaderBackButton text="목록가기" onPress={navigation.goBack} />,
            })}
          />
          <Stack.Group
            screenOptions={({ navigation }) => ({
              headerLeft: () => <HeaderCloseButton onPress={navigation.goBack} />,
              gestureEnabled: false,
              gestureDirection: 'vertical',
              headerMode: 'float',
            })}
          >
            <Stack.Screen
              name="CreateCampaign"
              component={CreateCampaign}
            />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ title: '프로필 수정' }}
            />
            <Stack.Screen
              name="It9yoPay"
              component={It9yoPay}
              options={{ title: '잇구요 페이' }}
            />
          </Stack.Group>
        </Stack.Navigator>

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

export default App;
