import React, { useCallback, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';

import Config from 'react-native-config';
import axios, { AxiosError, AxiosResponse } from 'axios';

import messaging from '@react-native-firebase/messaging';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  getProfile as getKakaoProfile, KakaoProfile,
  KakaoProfileNoneAgreement, login,
} from '@react-native-seoul/kakao-login';
import { NaverLogin, getProfile as getNaverProfile } from '@react-native-seoul/naver-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useRecoilState, useSetRecoilState } from 'recoil';
import EncryptedStorage from 'react-native-encrypted-storage';

import Logo from '@assets/images/logo.png';
import LogoTitle from '@assets/images/logoTitle.png';
import NaverBtn from '@assets/images/naverBtn.png';
import KakaoBtn from '@assets/images/kakaoBtn.png';
import GoogleBtn from '@assets/images/googleBtn.png';
import {
  location,
  signupState, userAccessToken, userFcmToken, userState,
} from '@src/states';
import {
  NaverKeyProps, RootStackParamList,
  UserAuthenticationProps,
} from '@src/@types';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const iosKeys: NaverKeyProps = {
  kConsumerKey: Config.NAVER_CLIENT_ID,
  kConsumerSecret: Config.NAVER_SECRET_ID,
  kServiceAppName: 'it9yo',
  kServiceAppUrlScheme: 'it9yo',
};

const androidKeys: NaverKeyProps = {
  kConsumerKey: Config.NAVER_CLIENT_ID,
  kConsumerSecret: Config.NAVER_SECRET_ID,
  kServiceAppName: 'it9yo',
};

const naverKeys = Platform.OS === 'ios' ? iosKeys : androidKeys;

const getNaverToken = (props: NaverKeyProps) => new Promise((resolve, reject) => {
  NaverLogin.login(props, (err, token) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(token);
  });
});

function SignIn({ navigation }: SignInScreenProps) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);
  const setUserInfo = useSetRecoilState(userState);
  const setAccessToken = useSetRecoilState(userAccessToken);
  const setLocation = useSetRecoilState(location);
  const [fcmToken, setFcmToken] = useRecoilState(userFcmToken);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const getPushPermissions = async () => {
    let authorized;
    const enabled = await messaging().hasPermission();

    if (!enabled) {
      authorized = await messaging().requestPermission();
    }

    if (enabled || authorized) {
      const token = await messaging().getToken();
      return token;
    }
  };

  const authenticateUser = useCallback(async ({ id, providerType }: UserAuthenticationProps) => {
    try {
      const mobileToken = await getPushPermissions();
      console.log({
        id,
        providerType,
        mobileToken,
      });
      const response: AxiosResponse<any, any> = await axios.post(
        `${Config.API_URL}/auth/login`,
        {
          id,
          providerType,
          mobileToken,
        },
      );

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data.data;
        setAccessToken(accessToken);
        await EncryptedStorage.setItem(
          'refreshToken',
          refreshToken,
        );

        const userResponseData = await axios.get(
          `${Config.API_URL}/user/detail`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log('userResponseData', userResponseData);
        const { siDo, siGunGu } = userResponseData.data.data;
        setLocation({
          siDo,
          siGunGu,
        });
        setUserInfo(userResponseData.data.data);
      }
    } catch (error) {
      // 회원가입이 되어있지 않은 경우
      console.error(error);
      if ((error as AxiosError).response?.status === 404) {
        setSignupInfo({
          ...signupInfo,
          providerUserId: id,
          providerType,
        });
        navigation.push('SignUp');
      }
    }
  }, []);

  const signInWithNaver = useCallback(async () => {
    try {
      const token: any = await getNaverToken(naverKeys);
      const profile = await getNaverProfile(token.accessToken);
      if (profile.resultcode === '024') {
        Alert.alert('로그인 실패', profile.message);
        return;
      }
      const { id } = profile.response;
      const userProps: UserAuthenticationProps = {
        id,
        providerType: 'NAVER',
      };
      authenticateUser(userProps);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const signInWithKakao = useCallback(async () => {
    let profile: KakaoProfile | KakaoProfileNoneAgreement | null = null;
    try {
      profile = await getKakaoProfile();
    } catch (profileError) {
      try {
        await login();
        profile = await getKakaoProfile();
      } catch (authProfileError) {
        console.error(authProfileError);
      }
    } finally {
      if (profile) {
        const { id } = profile;
        const userProps: UserAuthenticationProps = {
          id,
          providerType: 'KAKAO',
        };
        authenticateUser(userProps);
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const isSignedIn = await GoogleSignin.isSignedIn();

      let userInfoFromGoogle;
      if (isSignedIn) {
        userInfoFromGoogle = await GoogleSignin.signInSilently();
      } else {
        userInfoFromGoogle = await GoogleSignin.signIn();
      }
      const { id } = userInfoFromGoogle.user;
      console.log(id);
      const userProps: UserAuthenticationProps = {
        id,
        providerType: 'GOOGLE',
      };
      authenticateUser(userProps);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo}
        source={Logo}
      />
      <Image style={styles.logoTitle}
        source={LogoTitle}
      />
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.loginButton}
          onPress={signInWithNaver}
        >
          <Image style={styles.loginButtonLogo}
            source={NaverBtn}
          />
          <Text style={styles.loginButtonText}>네이버로 계속하기</Text>
        </Pressable>
        <Pressable
          style={styles.loginButton}
          onPress={signInWithKakao}
        >
          <Image style={styles.loginButtonLogo}
            source={KakaoBtn}
          />
          <Text style={styles.loginButtonText}>카카오로 계속하기</Text>
        </Pressable>
        <Pressable
          style={styles.loginButton}
          onPress={signInWithGoogle}
        >
          <Image style={styles.loginButtonLogo}
            source={GoogleBtn}
          />
          <Text style={styles.loginButtonText}>구글로 계속하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  logoTitle: {
    width: 120,
    height: 40,
    marginBottom: 30,
  },
  buttonZone: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
  },
  loginButtonLogo: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default SignIn;
