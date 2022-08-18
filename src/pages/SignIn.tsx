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
  getProfile as getKakaoProfile, KakaoOAuthToken, KakaoProfile,
  KakaoProfileNoneAgreement, login, logout,
} from '@react-native-seoul/kakao-login';
import { NaverLogin, getProfile as getNaverProfile } from '@react-native-seoul/naver-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { IMPConst } from 'iamport-react-native';
import { CertificationParams, RootStackParamList } from '../@types';

import Logo from '../assets/images/logo.png';
import LogoTitle from '../assets/images/logoTitle.png';
import NaverBtn from '../assets/images/naverBtn.png';
import KakaoBtn from '../assets/images/kakaoBtn.png';
import GoogleBtn from '../assets/images/googleBtn.png';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

interface UserAuthenticationProps {
  id: string;
  providerType: string;
}

interface UserResponseProps {
  data:{
    data: {
      accessToken: string;
      refreshToken: string;
      user: {
        userId: number;
        nickName: string;
        phoneNumber: string | null;
        homeAddress: string | null;
        profileImageUrl: string | null;
        providerType: string;
        roleType: string;
        introduction: string;
        badgeType: string;
        point: number;
        accountNumber: string | null;
      }
    }
  }
}

interface NaverKeyProps {
  kConsumerKey: string;
  kConsumerSecret: string;
  kServiceAppName: string;
  kServiceAppUrlScheme?: string;
}

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
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const authenticateUser = useCallback(async ({ id, providerType }: UserAuthenticationProps) => {
    try {
      const response: UserResponseProps = await axios.post(
        `${Config.API_URL}/user/auth/login`,
        {
          id,
          providerType,
        },
      );
      if (response.data.data.user.phoneNumber === null) {
        Alert.alert('알림', '회원가입을 위해 본인인증이 필요합니다');
        // TODO: params setting
        const data: CertificationParams = {
          params: {
            merchant_uid: `mid_${new Date().getTime()}`,
            company: '아임포트',
            carrier: '',
            name: '',
            phone: '',
            min_age: '',
            m_redirect_url: IMPConst.M_REDIRECT_URL,
          },
          tierCode: '',
        };
        navigation.navigate('Certification', data);
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const signInWithNaver = useCallback(async () => {
    try {
      const token = await getNaverToken(naverKeys);
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
    let profile: KakaoProfile | KakaoProfileNoneAgreement;
    try {
      profile = await getKakaoProfile();
    } catch (error) {
      try {
        const token: KakaoOAuthToken = await login();
        profile = await getKakaoProfile();
      } catch (error) {
        console.error(error);
      }
    } finally {
      const { id } = profile;
      const userProps: UserAuthenticationProps = {
        id,
        providerType: 'KAKAO',
      };
      authenticateUser(userProps);
    }
  }, []);

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
