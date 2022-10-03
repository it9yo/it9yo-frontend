import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { location } from '@src/states';
import EachCampaign from '@components/EachCampaign';

import Icon from 'react-native-vector-icons/Ionicons';
import { CampaignListData } from '@src/@types';

const campaignList = [
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

export function CampaignList({ navigation }) {
  const [currentLocation, setLocation] = useRecoilState(location);

  useEffect(() => {
    console.log(currentLocation);
  }, []);

  const onCampaignDetail = (campaignId: number) => {
    navigation.navigate('CampaignDetail', { campaignId });
  };

  const renderItem = ({ item }: { item: CampaignListData }) => <EachCampaign item={item}/>;

  return <SafeAreaView style={styles.container}>
    <View style={styles.navContainer}>
     <Pressable onPress={() => navigation.navigate('ChangeLocation')}>
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
    <FlatList
      data={campaignList}
      keyExtractor={(item) => item.campaignId.toString()}
      renderItem={renderItem}
    />

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('CreateCampaign')}
      style={styles.floatingButtonStyle}>
      <Icon name='add-circle' size={60}/>
    </TouchableOpacity>
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

  floatingButtonStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    right: 30,
    bottom: 80,
  },
});

export default CampaignList;
