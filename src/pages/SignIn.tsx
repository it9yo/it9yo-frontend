import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

import Logo from '../assets/images/logo.png';
import LogoTitle from '../assets/images/logoTitle.png';
import NaverBtn from '../assets/images/naverBtn.png';
import KakaoBtn from '../assets/images/kakaoBtn.png';
import GoogleBtn from '../assets/images/googleBtn.png';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignIn({ navigation }: SignInScreenProps) {
  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

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
          <Text style={styles.loginButtonText}>네이버로 회원가입</Text>
        </Pressable>
        <Pressable
          style={styles.loginButton}
          onPress={toSignUp}
        >
          <Image style={styles.loginButtonLogo}
            source={KakaoBtn}
          />
          <Text style={styles.loginButtonText}>카카오로 회원가입</Text>
        </Pressable>
        <Pressable
          style={styles.loginButton}
          onPress={toSignUp}
        >
          <Image style={styles.loginButtonLogo}
            source={GoogleBtn}
          />
          <Text style={styles.loginButtonText}>구글로 회원가입</Text>
        </Pressable>
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.loginButton}
          onPress={toSignUp}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
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
