import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppInner';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({ navigation }: SignUpScreenProps) {
  const toSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>회원가입 화면</Text>
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

export default SignUp;
