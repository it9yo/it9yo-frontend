import React, { useState } from 'react';
import {
  Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert, Platform,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';

import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function Mypage({ navigation }) {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);

  const onChangeProfilePhoto = async () => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        includeBase64: Platform.OS === 'android',
      });
      if (result.didCancel || !result.assets) {
        return;
      }
      const { uri, type, fileName } = result.assets[0];

      const formData = new FormData();
      formData.append('file', {
        name: fileName,
        type,
        uri,
      });

      const response = await axios.post(
        `${Config.API_URL}/user/edit/profileImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        const { profileImageUrl } = response.data.data;
        setUserInfo({
          ...userInfo,
          profileImageUrl,
        });
        console.log('profileImageUrl', profileImageUrl);
        Alert.alert('알림', '프로필 사진 변경이 완료되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onLogout = async () => {
    setUserInfo({
      userId: 0,
      username: '',
      providerType: '',
      nickName: '',
      phoneNumber: '',
      siDo: '',
      siGunGu: '',
      locationAuth: false,
      profileImageUrl: '',
      roleType: '',
      introduction: '',
      badgeType: '',
      point: 0,
      accountNumber: '',
      mobileToken: '',
    });
    setAccessToken('');

    await EncryptedStorage.setItem(
      'refreshToken',
      '',
    );
  };
  return (
  <SafeAreaView style={styles.container}>
    <ScrollView scrollToOverflowEnabled={false} style={{ height: '100%' }}>
      <View style={styles.mainContent}>
        <View style={styles.contentBlock}>
          <View style={{ alignItems: 'center' }}>
            {userInfo.profileImageUrl
              ? <Image style={styles.profileThumbnail} source={{ uri: userInfo.profileImageUrl }}/>
              : <View style={styles.profileThumbnail}>
              <Icon style={{ paddingTop: 7 }} name='ios-person' size={45} color='white' />
            </View>}
            <Pressable onPress={onChangeProfilePhoto}>
              <Icon name='camera-outline' size={30} color='gray' />
            </Pressable>
          </View>
          <Text style={{ color: 'black', fontSize: 18 }}>
            {userInfo.nickName}
          </Text>
          <View style={{ alignItems: 'center' }}>
            <Pressable onPress={() => navigation.navigate('EditProfile')}>
              <View style={styles.button}>
                <Text style={{ color: 'white', fontSize: 16 }}>프로필 수정</Text>
              </View>
            </Pressable>
            <Pressable onPress={onLogout}>
              <Text style={{ color: 'black', fontSize: 16, marginTop: 10 }}>로그아웃</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.horizenLine} />
        <View style={styles.contentBlock}>
          <Pressable onPress={() => navigation.navigate('It9yoPay')}>
            <View style={styles.button}>
              <Text style={{ color: 'white', fontSize: 16 }}>잇구요 페이</Text>
            </View>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 18 }}>
              {'잔여 포인트: '}
            </Text>
            <Text style={{ color: 'black', fontSize: 18, fontWeight: '500' }}>
              {`${numberWithCommas(userInfo.point)} P`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.menuBlock}>
          <Text style={styles.menuText}>
            완료한 공동구매 내역
          </Text>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>
        <View style={styles.horizenLine} />
        <View style={styles.menuBlock}>
          <Text style={styles.menuText}>
            후기 남기기
          </Text>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>
        <View style={styles.horizenLine} />
        <View style={styles.menuBlock}>
          <Text style={styles.menuText}>
            신고하기
          </Text>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>
        <View style={styles.horizenLine} />
        <View style={styles.menuBlock}>
          <Text style={styles.menuText}>
            찜한 공동구매 목록
          </Text>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>
        <View style={styles.horizenLine} />
        <View style={styles.menuBlock}>
          <Text style={styles.menuText}>
            문의하기
          </Text>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>
      </View>
      </ScrollView>
  </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  mainContent: {
    width: Dimensions.get('screen').width - 30,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
  },
  contentBlock: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  menuBlock: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizenLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  button: {
    maxWidth: 100,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2B950',
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
  },
  profileThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: 'gray',
  },
  menuText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
});

export default Mypage;
