import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  Alert,
  Dimensions,
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

  const canGoNext = changedNickName.length > 1;

  const onChangeProfile = async () => {
    if (!canGoNext) return;
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
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>프로필 수정</Text>

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
        onPress={onChangeProfile}>
        <Text style={styles.buttonText}>수정하기</Text>
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
export default EditProfile;
