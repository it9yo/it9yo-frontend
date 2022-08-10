import React, { useCallback, useState } from 'react';
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
  getProfile, KakaoOAuthToken, KakaoProfile, login,
} from '@react-native-seoul/kakao-login';
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

function SignIn({ navigation }: SignInScreenProps) {
  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();
    // console.log(`kakao token ${JSON.stringify(token)}`);
    const profile: KakaoProfile = await getProfile();
    // console.log(`kakao profile ${JSON.stringify(profile)}`);
    const { id } = profile;
    console.log(id);
    const userProps: userAuthenticationProps = {
      id,
      ProviderType: 'KAKAO',
    };
  };

  const authenticateUser = useCallback(({ id, ProviderType }: userAuthenticationProps) => {
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
          onPress={toSignUp}
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
          onPress={toSignUp}
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
