import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect } from 'react';
import {
  Image, Pressable, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from '../@types';

import Congraturation from '../assets/images/congraturation.png';
import {
  signupState, userAccessToken, userFcmToken, userState,
} from '../recoil';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignupComplete({ navigation }: SignInScreenProps) {
  const signupInfo = useRecoilState(signupState)[0];
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const fcmToken = useRecoilState(userFcmToken)[0];
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);

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
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.loginButton}
          onPress={onLogin}
        >
          <Text style={styles.loginButtonText}>홈으로 이동</Text>
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

export default SignupComplete;
