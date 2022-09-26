import React, { useEffect } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { location } from '@src/states';

import StatusNameList from '@constants/statusname';
import Icon from 'react-native-vector-icons/Ionicons';

const chatList = [
  {
    campaignId: 1,
    campaignTitle: '마카롱 공구해요',
    itemPrice: 1000,
    campaignLocation: '자양 1동',
    campaignThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'DELIVERED',
    participatedPersonCnt: 5,
    hostName: '지운',
  },
  {
    campaignId: 2,
    campaignTitle: '싱싱 꼬막 무침 공구',
    itemPrice: 10000,
    campaignLocation: '자양 1동',
    campaignThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'COMPLETED',
    participatedPersonCnt: 5,
    hostName: '지운',

  },
  {
    campaignId: 3,
    campaignTitle: '상주 곶감 산지 직송',
    itemPrice: 8000,
    campaignLocation: '자양 1동',

    campaignThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'DISTRIBUTING',
    participatedPersonCnt: 5,
    hostName: '지운',

  },
  {
    campaignId: 4,
    campaignTitle: '아라비카 커피 원두',
    itemPrice: 5000,
    campaignLocation: '자양 1동',

    campaignThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'DELIVERING',
    participatedPersonCnt: 5,
    hostName: '지운',

  },
  {
    campaignId: 5,
    campaignTitle: '천안 호두과자',
    itemPrice: 3000,
    campaignLocation: '자양 1동',

    campaignThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'CANCELED',
    participatedPersonCnt: 5,
    hostName: '지운',

  },
  {
    campaignId: 6,
    campaignTitle: '스테비아 토마토 공구',
    itemPrice: 3000,
    campaignLocation: '자양 1동',

    campaignThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'CONFIRM',
    participatedPersonCnt: 5,
    hostName: '지운',

  },

];

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function CampaignList({ navigation }) {
  const [currentLocation, setLocation] = useRecoilState(location);

  useEffect(() => {
    console.log(currentLocation);
  }, []);

  const onCampaignDetail = (campaignId: number) => {
    navigation.navigate('CampaignDetail', { campaignId });
  };

  return <SafeAreaView style={styles.container}>
    <View style={styles.navContainer}>
     <Pressable>
      <View style={styles.locationZone}>
        <Text style={styles.locationText}>
          {currentLocation.siGunGu ? currentLocation.siGunGu : currentLocation.siDo}
        </Text>
        <Icon style={{ paddingLeft: 2 }} name="chevron-down" size={24} color="#000" />
      </View>
     </Pressable>
     <View style={styles.navButtonZone}>
      <Pressable>
        <Icon name="filter" size={28} color="#000" />
      </Pressable>
      <Pressable style={{ marginLeft: 5 }} onPress={() => navigation.navigate('Search')}>
        <Icon name="search" size={24} color="#000" />
      </Pressable>
     </View>
    </View>
    <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('CreateCampaign')}
          style={styles.floatingButtonStyle}>
          <Icon name='add-circle' size={60}/>
        </TouchableOpacity>
    <ScrollView>
      {chatList.map(({
        campaignId, campaignTitle, itemPrice, campaignLocation,
        campaignThumbnailUrl, campaignStatus, participatedPersonCnt, hostName,
      }) => <Pressable
        onPress={() => onCampaignDetail(campaignId)}
      >
        <View style={styles.campaignListZone}>
          <Image style={styles.campaignThumbnail}
            source={{
              uri: campaignThumbnailUrl,
            }}
          />
          <View>
            <Text style={styles.campaignTitleText}>{campaignTitle}</Text>
            <View style={styles.hostInfoZone}>
              <Icon name="person-outline" size={16} color="#000" />
              <Text style={styles.hostNameZone}>{hostName}</Text>
            </View>
            <Text style={styles.priceText}>{`${numberWithCommas(itemPrice)} 원`}</Text>
          </View>
          <View style={styles.chatStateView}>
            <Text style={styles.statusText}>{StatusNameList[campaignStatus]}</Text>
            <Text style={styles.userCntText}>{campaignLocation}</Text>
            <Text style={styles.userCntText}>{`${participatedPersonCnt}명 참여중`}</Text>
          </View>
        </View>
        </Pressable>)}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderBottom: 1,
    borderBottomColor: 'black',
    height: 56,
  },
  navButtonZone: {
    position: 'absolute',
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontWeight: '500',
    fontSize: 25,
    color: 'black',
  },
  locationZone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campaignListZone: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  hostNameZone: {
    color: 'orange',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 2,
  },
  hostInfoZone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusText: {
    color: 'red',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 8,
  },
  userCntText: {
    color: 'orange',
    fontWeight: '600',
    fontSize: 16,
    paddingTop: 5,
  },
  chatStateView: {
    alignItems: 'flex-end',
    fontFamily: 'Proxima Nova',
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 14,
  },
  campaignThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 80 / 2,
    marginRight: 10,
  },
  campaignTitleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 24,
    color: 'black',
  },
  floatingButtonStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    right: 30,
    bottom: 80,
    backgroundColor: 'red',
  },
});

export default CampaignList;
