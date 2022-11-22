import React, { useEffect } from 'react';
import {
  Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert, Platform,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { locationState, userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import Review from '@assets/images/review.png';
import DoneCampaign from '@assets/images/done-campaign.png';
import OnHeart from '@assets/images/on-heart.png';
import Survey from '@assets/images/survey.png';
import GPSIcon from '@assets/images/gps.png';

import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

function Mypage({ navigation }) {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(userAccessToken);
  const currentLocation = useRecoilValue(locationState);

  useEffect(() => {
    console.log(currentLocation);
  }, []);

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
      formData.append('files', {
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

  const onReset = async () => {
    await AsyncStorage.clear();
    Alert.alert('async 초기화');
  };

  return (
  <SafeAreaView style={styles.container}>
    <ScrollView scrollToOverflowEnabled={false} style={{ height: '100%' }}>
      <View style={styles.mainContent}>

        {/* 프로필 */}
        <View style={styles.contentBlock}>
          <View style={{ alignItems: 'center' }}>
            {userInfo.profileImageUrl
              ? <Image style={styles.profileThumbnail} source={{ uri: userInfo.profileImageUrl }}/>
              : <View style={styles.profileThumbnail}>
              <Icon style={{ paddingTop: 7 }} name='ios-person' size={60} color='white' />
            </View>}

          </View>
          <Pressable onPress={onChangeProfilePhoto} style={styles.changeProfilePhotoContainer}>
            <Icon name='camera-outline' size={15} color='gray' />
          </Pressable>
          <Text style={{
            color: 'black', fontSize: 18, position: 'relative', left: -60,
          }}>
            {userInfo.nickName}
          </Text>

          <View style={{ alignItems: 'center' }}>
            <Pressable onPress={() => navigation.navigate('EditProfile')}>
              <View style={styles.button}>
                <Text style={{ color: '#f6aa63', fontSize: 13 }}>프로필 수정</Text>
              </View>
            </Pressable>
            <Pressable onPress={onLogout}>
            <View style={styles.button}>
                <Text style={{ color: '#f6aa63', fontSize: 13 }}>로그아웃</Text>
              </View>
            </Pressable>
          </View>
        </View>

      </View>

      <View style={styles.mainContent}>
        {/* 찜한 공동구매 목록 */}
        <Pressable onPress={() => navigation.navigate('WishList')}>
          <View style={styles.menuBlock}>
          <View style={{ flexDirection: 'row' }}>
          <Image style={styles.icon} source={OnHeart}/>
            <Text style={styles.menuText}>
              찜한 공동구매 목록
            </Text>
          </View>
            <Icon name='ios-chevron-forward' size={24} color='black' />
          </View>
        </Pressable>

        <View style={styles.horizenLine} />

        {/* 지역 인증 하기 */}
        <Pressable onPress={() => navigation.navigate('LocCert', { currentLocation })}>
          <View style={styles.menuBlock}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 25, height: 30 }} source={GPSIcon}/>
            <Text style={styles.menuText}>
              지역 인증 하기
            </Text>
          </View>
            <Icon name='ios-chevron-forward' size={24} color='black' />
          </View>
        </Pressable>

        <View style={styles.horizenLine} />

        {/* 후기 남기기 */}
        <View style={styles.menuBlock}>
        <View style={{ flexDirection: 'row' }}>
          <Image style={styles.icon} source={Review}/>
            <Text style={styles.menuText}>
              후기 남기기
            </Text>
        </View>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>

        <View style={styles.horizenLine} />

        {/* 완료한 공동구매 내역 */}
        <View style={styles.menuBlock}>
        <View style={{ flexDirection: 'row' }}>
        <Image style={styles.icon} source={DoneCampaign}/>
          <Text style={styles.menuText}>
            완료한 공동구매 내역
          </Text>
        </View>
          <Icon name='ios-chevron-forward' size={24} color='black' />
        </View>

        <View style={styles.horizenLine} />

        {/* 신고하기 */}
        <Pressable onPress={() => navigation.navigate('Report')}>
          <View style={styles.menuBlock}>
            <View style={{ flexDirection: 'row' }}>
            <Image style={styles.icon} source={Survey}/>
              <Text style={styles.menuText}>
                신고하기
              </Text>
            </View>
              <Icon name='ios-chevron-forward' size={24} color='black' />
          </View>
        </Pressable>

        {/* async storage 초기화 */}
        {/* <Pressable onPress={onReset}>
          <View style={styles.menuBlock}>
            <View style={{ flexDirection: 'row' }}>
            <Image style={styles.icon} source={Survey}/>
              <Text style={styles.menuText}>
                async 초기화
              </Text>
            </View>
              <Icon name='ios-chevron-forward' size={24} color='black' />
          </View>
        </Pressable> */}

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
    marginTop: 9,
    marginBottom: 9,
  },
  horizenLine: {
    borderBottomColor: '#f6f6f6',
    borderBottomWidth: 2,
  },
  button: {
    width: 92,
    height: 36,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7ef',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#f6aa63',
  },
  profileThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    backgroundColor: 'gray',
    borderRadius: 30,
  },
  menuText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 20,
  },
  changeProfilePhotoContainer: {
    backgroundColor: 'white',
    position: 'relative',
    left: -50,
    top: 25,
    zIndex: 0,
    borderRadius: 20,
    borderWidth: 1,
    padding: 3,
    borderColor: '#eeeeee',
  },
  icon: {
    width: 25,
    height: 25,
  },
  payPoint: {
    color: '#ff9e3e',
    fontSize: 14,
    marginRight: 20,
  },
});

export default Mypage;
