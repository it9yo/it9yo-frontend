import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert,
} from 'react-native';

import Config from 'react-native-config';
import axios, { AxiosError } from 'axios';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  getProfile as getKakaoProfile, KakaoOAuthToken, KakaoProfile, login,
} from '@react-native-seoul/kakao-login';
import { NaverLogin, getProfile as getNaverProfile } from '@react-native-seoul/naver-login';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { RootStackParamList } from '../../App';

import Logo from '../assets/images/logo.png';
import LogoTitle from '../assets/images/logoTitle.png';
import NaverBtn from '../assets/images/naverBtn.png';
import KakaoBtn from '../assets/images/kakaoBtn.png';
import GoogleBtn from '../assets/images/googleBtn.png';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

interface userAuthenticationProps {
  id: string;
  ProviderType: string;
}

const iosKeys = {
  kConsumerKey: Config.NAVER_CLIENT_ID,
  kConsumerSecret: Config.NAVER_SECRET_ID,
  kServiceAppName: 'it9yo',
  kServiceAppUrlScheme: 'it9yo',
};

const androidKeys = {
  kConsumerKey: Config.NAVER_CLIENT_ID,
  kConsumerSecret: Config.NAVER_SECRET_ID,
  kServiceAppName: 'it9yo',
};

const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;

const getNaverToken = (props) => new Promise((resolve, reject) => {
  NaverLogin.login(props, (err, token) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(token);
  });
});

function SignIn({ navigation }: SignInScreenProps) {
  useEffect(() => {
    GoogleSignin.configure({
      offlineAccess: false,
      iosClientId: Config.GOOGLE_CLIENT_ID_IOS,
    });
  }, []);

  // const toSignUp = useCallback(() => {
  //   navigation.navigate('SignUp');
  // }, [navigation]);

  const signInWithGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const isSignedIn = await GoogleSignin.isSignedIn();

      let userInfo;
      if (isSignedIn) {
        userInfo = await GoogleSignin.signInSilently();
      } else {
        userInfo = await GoogleSignin.signIn();
      }
      const { id } = userInfo.user;
      const userProps: userAuthenticationProps = {
        id,
        ProviderType: 'GOOGLE',
      };
      // TODO:
    } catch (error) {
      console.error(error);
    }
  }, []);

  const signInWithNaver = useCallback(async () => {
    try {
      const token = await getNaverToken(initials);
      const profile = await getNaverProfile(token.accessToken);
      if (profile.resultcode === '024') {
        Alert.alert('로그인 실패', profile.message);
        return;
      }
      const { id } = profile.response;
      const userProps: userAuthenticationProps = {
        id,
        ProviderType: 'NAVER',
      };
    // TODO:
    } catch (error) {
      console.error(error);
    }
  }, []);

  const signInWithKakao = useCallback(async () => {
    try {
      const token: KakaoOAuthToken = await login();
      const profile: KakaoProfile = await getKakaoProfile();
      const { id } = profile;
      console.log(id);
      const userProps: userAuthenticationProps = {
        id,
        ProviderType: 'KAKAO',
      };
      // TODO:
    } catch (error) {
      console.error(error);
    }
  }, []);

  const authenticateUser = useCallback(async ({ id, ProviderType }: userAuthenticationProps) => {
    try {
      const response = await axios.post(
        `${
          Platform.OS === 'ios' ? Config.API_URL_IOS : Config.API_URL_ANDROID
        }/user/auth/login`,
        {
          id,
          ProviderType,
        },
      );
      console.log(response.data);
      // TODO: 회원가입 여부 체크
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
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
    </View>
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
