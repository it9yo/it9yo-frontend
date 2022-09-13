import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { RootStackParamList } from '@src/@types';
import { signupState } from '@src/states';

type Props = NativeStackScreenProps<RootStackParamList, 'AdditionalInfo'>;

function AdditionalInfo({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [nickName, setNickName] = useState('');
  const [introduction, setIntroduction] = useState('');

  const canGoNext = !!nickName;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setNickName(text.trim())}
          placeholder="닉네임을 입력해주세요"
          placeholderTextColor="#666"
          // textContentType="telephoneNumber"
          value={nickName}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>자기소개</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setIntroduction}
          placeholder="자기소개를 입력해주세요(선택)"
          placeholderTextColor="#666"
          value={introduction}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.buttonZone}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => navigation.pop()}>
          <Text style={styles.buttonText}>이  전</Text>
        </TouchableOpacity>
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
              nickName,
              introduction,
            });
            navigation.push('Location');
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
  },
  label: {
    marginVertical: 5,
    fontSize: 16,
  },
  introduceInput: {
    // lineHeight: 100,
    // borderWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    width: 300,
    padding: 5,
    marginTop: 5,
    marginRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
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

export default AdditionalInfo;
