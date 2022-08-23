import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { RootStackParamList } from '../@types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdditionalInfo'>;

function AdditionalInfo({ navigation }: Props) {
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');

  const canGoNext = !!nickname;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setNickname(text.trim())}
          placeholder="닉네임을 입력해주세요"
          placeholderTextColor="#666"
          // textContentType="telephoneNumber"
          value={nickname}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>자기소개</Text>
        <TextInput
          style={StyleSheet.compose(styles.textInput, styles.introduceInput)}
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
          onPress={() => navigation.push('Location')}>
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
  },
  introduceInput: {
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textInput: {
    width: 300,
    padding: 5,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
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
