import React, { useState, useCallback } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { signupState } from '@states';
import { RootStackParamList } from '@src/@types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneCertification'>;

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
      const response = await axios.post(
        `${Config.API_URL}/auth/phoneAuth`,
        {
          tel: phoneNumber,
        },
      );
      setCertNumber(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangePhoneNumber}
          placeholder="전화번호 입력"
          placeholderTextColor="#666"
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
          <Text style={styles.buttonText}>인증번호 전송</Text>
        </Pressable>
      </View>

      {certNumber && (
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeUserCertNumber}
            placeholder="인증번호 입력"
            placeholderTextColor="#666"
            value={userCertNumber}
            clearButtonMode="while-editing"
            blurOnSubmit={false}
            editable={!authenticated}
            selectTextOnFocus={!authenticated}
            keyboardType="numeric"
          />
          <Pressable
            style={styles.submitButton}
            onPress={submitUserCertNumber}
            disabled={loading || authenticated}
          >
            <Text style={styles.buttonText}>인증번호 제출</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.buttonZone}>

        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => navigation.pop()}>
          <Text style={styles.buttonText}>이  전</Text>
        </TouchableOpacity>

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
          <Text style={styles.buttonText}>다음으로</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputWrapper: {
    padding: 20,
    flexDirection: 'row',
  },
  textInput: {
    width: 220,
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  submitButton: {
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonZone: {
    position: 'absolute',
    width: '90%',
    bottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  button: {
    width: '45%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PhoneCertification;
