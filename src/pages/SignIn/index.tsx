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

import NaverBtn from '@assets/images/naverBtn.png';
import KakaoBtn from '@assets/images/kakaoBtn.png';
import GoogleBtn from '@assets/images/googleBtn.png';
import {
  signupState, userAccessToken, userState,
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
        setUserInfo(userResponseData.data.data);
      }
    } catch (error) {
      // 회원가입이 되어있지 않은 경우
      if ((error as AxiosError).response.data.code === 'userNotFound') {
        setSignupInfo({
          ...signupInfo,
          providerUserId: id,
          providerType,
        });
        navigation.push('SignUp');
      } else {
        console.error(error);
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

      <View style={styles.logoTitle}>
        <Text style={styles.logoText}>
          잇구요
        </Text>
      </View>

      <View style={styles.buttonZone}>

        <Pressable
          style={StyleSheet.compose(styles.loginButton, { backgroundColor: '#ffea0f' })}
          onPress={signInWithKakao}
        >
          <Image style={styles.loginButtonLogo}
            source={KakaoBtn}
          />
          <Text style={styles.loginButtonText}>카카오로 계속하기</Text>
        </Pressable>

        <Pressable
          style={StyleSheet.compose(styles.loginButton, { backgroundColor: '#eeeeee' })}
          onPress={signInWithGoogle}
        >
          <Image style={styles.loginButtonLogo}
            source={GoogleBtn}
          />
          <Text style={styles.loginButtonText}>구글로 계속하기</Text>
        </Pressable>

        <Pressable
          style={StyleSheet.compose(styles.loginButton, { backgroundColor: '#71c65c' })}
          onPress={signInWithNaver}
        >
          <Image style={styles.loginButtonLogo}
            source={NaverBtn}
          />
          <Text style={StyleSheet.compose(styles.loginButtonText, { color: '#ffffff' })}>
            네이버로 계속하기
          </Text>
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
    width: 180,
    height: 180,
  },
  logoTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: 300,
  },
  logoText: {
    height: 45,
    fontFamily: 'NEXONLv2Gothic',
    fontSize: 30,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 45,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#e27919',
  },
  buttonZone: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 320,
    height: 48,
    borderRadius: 8,
  },
  loginButtonLogo: {
    position: 'absolute',
    left: 20,
    width: 25,
    height: 25,
  },
  loginButtonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#1f1f1f',
  },
});

export default SignIn;
