import React from 'react';
import {
  Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
  signupState, userAccessToken, userFcmToken, userState,
} from '@src/states';
import Congraturation from '@assets/images/congraturation.png';

function SignupComplete() {
  const signupInfo = useRecoilState(signupState)[0];
  const setUserInfo = useSetRecoilState(userState);
  const fcmToken = useRecoilState(userFcmToken)[0];
  const setAccessToken = useSetRecoilState(userAccessToken);

  const onLogin = async () => {
    const { providerUserId, providerType } = signupInfo;
    const mobileToken = fcmToken;

    try {
      const response = await axios.post(
        `${Config.API_URL}/auth/login`,
        {
          id: providerUserId,
          providerType,
          mobileToken,
        },
      );
      if (response.status === 200) {
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo}
        source={Congraturation}
      />
      <Text style={styles.title}>회원가입을 환영합니다</Text>
      <Text style={styles.subTitle}>{signupInfo.nickName} 님의 회원가입을 축하합니다.</Text>

      <TouchableOpacity
        style={StyleSheet.compose(styles.button, styles.buttonActive)}
        onPress={onLogin}
      >
        <Text style={styles.buttonText}>홈으로</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#121212',
    marginVertical: 25,
  },
  subTitle: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 19.5,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#3b3b3b',
  },
  buttonZone: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ababab',
  },
  buttonActive: {
    backgroundColor: '#ff9e3e',
  },
  buttonText: {
    width: 180,
    height: 20,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default SignupComplete;
