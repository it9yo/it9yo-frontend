import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import React from 'react';
import {
  Image, Pressable, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from '../@types';

import Congraturation from '../assets/images/congraturation.png';
import { signupState } from '../recoil';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignupComplete({ navigation }: SignInScreenProps) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo}
        source={Congraturation}
      />
      <View style={styles.buttonZone}>
        <Pressable
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>회원가입 완료</Text>
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
