import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  Alert,
  SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import Config from 'react-native-config';

function EditProfile({ navigation }) {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const accessToken = useRecoilState(userAccessToken)[0];
  const { nickName, introduction } = userInfo;

  const [changedNickName, setNickName] = useState(nickName);
  const [changedIntroduction, setIntroduction] = useState(introduction);

  const onChangeProfile = async () => {
    if (!changedNickName) {
      Alert.alert('알림', '닉네임은 필수입니다.');
    } else if (changedNickName.length < 2) {
      Alert.alert('알림', '닉네임은 2자 이상 입니다.');
    } else {
      try {
        const response: AxiosResponse = await axios.patch(
          `${Config.API_URL}/user/edit`,
          {
            nickName: changedNickName,
            introduction: changedIntroduction,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.status === 200) {
          setUserInfo({
            ...userInfo,
            nickName: changedNickName,
            introduction: changedIntroduction,
          });
          Alert.alert('알림', '프로필 수정이 완료되었습니다.');
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (<SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setNickName(text.trim())}
          placeholder="닉네임을 입력해주세요"
          placeholderTextColor="#666"
          value={changedNickName}
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
          value={changedIntroduction}
          clearButtonMode="while-editing"
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.buttonZone}>
        <TouchableOpacity style={styles.button} onPress={onChangeProfile}>
          <Text style={styles.buttonText}>변경하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Text style={{ fontSize: 16 }}>취소</Text>
        </TouchableOpacity>
      </View>
  </SafeAreaView>);
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
  textInput: {
    width: 300,
    padding: 5,
    marginTop: 5,
    marginRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonZone: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
export default EditProfile;
