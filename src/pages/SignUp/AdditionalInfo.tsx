import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useRecoilState } from 'recoil';
import { SignUpParamList } from '@src/@types';
import { signupState } from '@src/states';

type Props = NativeStackScreenProps<SignUpParamList, 'AdditionalInfo'>;

function AdditionalInfo({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [nickName, setNickName] = useState('');
  const [introduction, setIntroduction] = useState('');

  const canGoNext = nickName.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>추가정보 입력</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setNickName(text.trim())}
          placeholder="닉네임 입력"
          placeholderTextColor="#c2c2c2"
          value={nickName}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          onChangeText={setIntroduction}
          placeholder="자기소개 입력"
          placeholderTextColor="#c2c2c2"
          value={introduction}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>

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
    marginBottom: 10,
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
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default AdditionalInfo;
