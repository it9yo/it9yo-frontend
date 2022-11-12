import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { SignUpParamList } from '@src/@types';
import { signupState } from '@src/states';

type Props = NativeStackScreenProps<SignUpParamList, 'Terms'>;

function Terms({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const canGoNext = true;
  return (
    <SafeAreaView style={styles.container}>
      <Text>약관 동의 화면</Text>

      <TouchableOpacity
        style={
          canGoNext
            ? StyleSheet.compose(styles.button, styles.buttonActive)
            : styles.button
        }
        disabled={!canGoNext}
        onPress={() => {
          setSignupInfo({
            ...signupInfo,
            agree: true,
          });
          navigation.push('PhoneCertification');
        }}>
        <Text style={styles.buttonText}>동의하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default Terms;
