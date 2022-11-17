import React, { useState, useCallback } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { signupState } from '@src/states';
import { SignUpParamList } from '@src/@types';

type Props = NativeStackScreenProps<SignUpParamList, 'PhoneCertification'>;

function PhoneCertification({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const [userCertNumber, setUserCertNumber] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const onChangePhoneNumber = useCallback((text: string) => {
    setPhoneNumber(text.trim());
  }, []);

  const onChangeUserCertNumber = useCallback(async (text: string) => {
    setUserCertNumber(text.trim());
  }, [userCertNumber]);

  const submitPhoneNumber = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      Alert.alert('알림', '휴대폰 번호를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const phoneNumberCheck = await axios.post(
        `${Config.API_URL}/auth/phoneExists`,
        {
          phoneNumber,
        },
      );

      if (phoneNumberCheck.status === 200) {
        const response = await axios.post(
          `${Config.API_URL}/auth/phoneAuth`,
          {
            tel: phoneNumber,
          },
        );
        setCertNumber(response.data.data);
      }
    } catch (error) {
      const { code, message } = error.response.data;
      if (code === 'phoneAlreadyExists') {
        Alert.alert('알림', message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, certNumber]);

  const submitUserCertNumber = useCallback(async () => {
    if (certNumber === userCertNumber) {
      Alert.alert('알림', '휴대폰 번호 인증이 완료되었습니다');
      setAuthenticated(true);
    } else {
      Alert.alert('알림', '인증 번호가 일치하지 않습니다');
    }
  }, [certNumber, userCertNumber]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>휴대폰 인증</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangePhoneNumber}
          placeholder="휴대폰 번호"
          placeholderTextColor="#c2c2c2"
          textContentType="telephoneNumber"
          value={phoneNumber}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
          editable={!authenticated}
          selectTextOnFocus={!authenticated}
          keyboardType="numeric"
        />
        <Pressable
          style={styles.submitButton}
          onPress={submitPhoneNumber}
          disabled={loading || authenticated}
        >
          {certNumber
            ? <Text style={styles.submitText}>인증번호 재전송</Text>
            : <Text style={styles.submitText}>인증번호 받기</Text>
          }
        </Pressable>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeUserCertNumber}
          placeholder="인증번호"
          placeholderTextColor="#c2c2c2"
          value={userCertNumber}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
          editable={!authenticated}
          selectTextOnFocus={!authenticated}
          keyboardType="numeric"
        />
        {certNumber
        && <Pressable
          style={styles.checkButton}
          onPress={submitUserCertNumber}
          disabled={loading || authenticated}
        >
          <Text style={styles.checkButtonText}>확인</Text>
        </Pressable>
        }
      </View>

      <TouchableOpacity
        style={
          authenticated
            ? StyleSheet.compose(styles.button, styles.buttonActive)
            : styles.button
        }
        disabled={!authenticated}
        onPress={() => {
          setSignupInfo({
            ...signupInfo,
            phoneNumber,
          });
          navigation.push('AdditionalInfo');
        }}>
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#282828',
    marginTop: 20,
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 20,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: 117,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff7ef',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#f6aa63',
    marginLeft: 10,
  },
  submitText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#e27919',
  },
  checkButton: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 32,
    borderRadius: 32,
    backgroundColor: '#828282',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#fbf4f7',
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

export default PhoneCertification;
