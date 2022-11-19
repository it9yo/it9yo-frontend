import React, { useEffect } from 'react';

import SplashScreen from 'react-native-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import { useRecoilState } from 'recoil';

import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import HomeTabs from '@pages/HomeTabs';
import ChatRoom from '@pages/Chat/ChatRoom';
import CampaignDetail from '@pages/Home/CampaignDetail';
import Search from '@pages/Home/Search';
import EditProfile from '@pages/Mypage/EditProfile';
import It9yoPay from '@pages/Mypage/It9yoPay';
import ChangeLocation from '@pages/Home/ChangeLocation';
import ChangeLocationCert from '@pages/Home/ChangeLocationCert';
import CreateCampaign from '@pages/Home/CreateCampaign';
import SearchAddress from '@pages/Home/SearchAddress';
import WishList from '@pages/Mypage/WishList';

import { userState, userAccessToken } from '@src/states';

import BackButton from '@components/Header/BackButton';
import ManageCampaign from '@src/pages/Manage/ManageCampaign';
import CreateReview from '@src/pages/Manage/CreateReview';
import HostReview from '@src/pages/Home/CampaignDetail/HostReview';

const Stack = createNativeStackNavigator();

function App() {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);

  const isLoggedIn = !!userInfo.userId;

  useEffect(() => {
    SplashScreen.hide();
    console.log('user info', userInfo);
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
          `${Config.API_URL}/user/detail`,
          {
            headers: {
              Authorization: `Bearer ${response.data.data.accessToken}`,
            },
          },
        );
        setUserInfo(userResponseData.data.data);
      } catch (error) {
        console.error(error);
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
        return Promise.reject(error);
      },
    );
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator>
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="CampaignDetail" options={{ headerShown: false }} component={CampaignDetail} />
          <Stack.Group
            screenOptions={({ navigation }) => ({
              headerLeft: () => <BackButton onPress={navigation.goBack} />,
              gestureDirection: 'vertical',
              headerMode: 'float',
              headerTitleStyle: {
                fontFamily: 'SpoqaHanSansNeo',
                fontSize: 18,
                fontWeight: '700',
                color: '#1f1f1f',
              },
            })}
          >
            <Stack.Screen
              name="CreateCampaign"
              component={CreateCampaign}
              options={{ title: '캠페인 생성' }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoom}
            />
            <Stack.Screen
              name="ManageCampaign"
              component={ManageCampaign}
            />
            <Stack.Screen
              name="ChangeLocationCert"
              component={ChangeLocationCert}
              options={{ title: '지역 인증' }}
              />
              <Stack.Screen
              name="SearchAddress"
              component={SearchAddress}
              options={{ title: '주소 검색' }}
              />
            <Stack.Screen name="Search"
              component={Search}
              options={{ headerShown: false }}
            />
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
            <Stack.Screen
              name="ChangeLocation"
              component={ChangeLocation}
              options={{ title: '지역 변경' }}
            />
            <Stack.Screen
              name="WishList"
              component={WishList}
              options={{ title: '찜 목록' }}
            />
            <Stack.Screen
              name="CreateReview"
              component={CreateReview}
              options={{ title: '슈퍼바이어 평가하기' }}
            />
            <Stack.Screen
              name="HostReview"
              component={HostReview}
              options={{ title: '슈퍼바이어 프로필' }}
            />
          </Stack.Group>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName='SignIn'>
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
