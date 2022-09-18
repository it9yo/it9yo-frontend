import React from 'react';
import {
  Dimensions, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import StatusNameList from '@src/constants/statusname';
import Icon from 'react-native-vector-icons/Ionicons';

const campaignDetaildata: CampaignDetailData = {
  campaignId: 1,
  title: '상주 곶감',
  tags: ['곶감', '상주', '달달'],
  description: '맛있는 상주 곶감!',
  itemPrice: 1000,
  itemImageURLs: ['https://cdn.kbmaeil.com/news/photo/202001/835750_854186_5024.jpg', 'https://uyjoqvxyzgvv9714092.cdn.ntruss.com/data2/content/image/2020/11/19/20201119299991.jpg'],
  siDo: '서울시',
  siGunGu: '광진구',
  eupMyeonDong: '구의동',
  detailAddress: '구의동 10-10',
  deadLine: '2017-03-04',
  campaignStatus: 'RECRUITING',
  participatedPersonCnt: 0,
  totalOrderedItemCnt: 0,
  pageLinkUrl: '4735f881-ca32-4881-adf7-5f1e02bd43f2',
  maxQuantityPerPerson: 10,
  minQuantityPerPerson: 5,
  hostId: 6,
  hostName: '지운',
  campaignCategory: 'FOOD',
  chatRoomId: 1,
};

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function Mypage() {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const setAccessToken = useSetRecoilState(userAccessToken);

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
            <Icon name='camera-outline' size={30} color='gray' />
          </View>
          <Text style={{ color: 'black', fontSize: 18 }}>
            {userInfo.nickName}
          </Text>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.button}>
              <Text style={{ color: 'white', fontSize: 16 }}>프로필 수정</Text>
            </View>
            <Pressable onPress={onLogout}>
              <Text style={{ fontSize: 16, marginTop: 10 }}>로그아웃</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.horizenLine} />
        <View style={styles.contentBlock}>
          <View style={styles.button}>
            <Text style={{ color: 'white', fontSize: 16 }}>잇구요 페이</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>
              {'잔여 포인트: '}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>
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
    fontSize: 18,
    fontWeight: '400',
  },
});

export default Mypage;
