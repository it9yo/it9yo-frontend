import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  FlatList, Image, Pressable, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { location } from '@src/states';
import EachCampaign from '@components/EachCampaign';

import Icon from 'react-native-vector-icons/Ionicons';
import { CampaignListData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { userAccessToken } from '../../states/user';

const campaignList = [
  {
    campaignId: 1,
    title: '마카롱 공구해요',
    itemPrice: 1000,
    eupMyeonDong: '자양 1동',
    itemImageURLs: ['https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg'],
    campaignStatus: 'DELIVERED',
    participatedPersonCnt: 5,
    hostName: '지운',

    tags: [],
    description: '',
    siDo: '서울시',
    siGunGu: '광진구',
    detailAddress: '',
    deadLine: '2019-01-01',
    totalOrderedItemCnt: 5,
    pageLinkUrl: '',
    maxQuantityPerPerson: 0,
    minQuantityPerPerson: 0,
    hostId: 1,
    campaignCategory: 'FOOD',
    chatRoomName: '',
    chatRoomParticipatedPersonCnt: 10,
  },
  {
    campaignId: 2,
    title: '싱싱 꼬막 무침 공구',
    itemPrice: 10000,
    eupMyeonDong: '자양 1동',
    itemImageURLs: ['https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg'],
    campaignStatus: 'COMPLETED',
    participatedPersonCnt: 5,
    hostName: '지운',

    tags: [],
    description: '',
    siDo: '서울시',
    siGunGu: '광진구',
    detailAddress: '',
    deadLine: '2019-01-01',
    totalOrderedItemCnt: 5,
    pageLinkUrl: '',
    maxQuantityPerPerson: 0,
    minQuantityPerPerson: 0,
    hostId: 1,
    campaignCategory: 'FOOD',
    chatRoomName: '',
    chatRoomParticipatedPersonCnt: 10,
  },
  {
    campaignId: 3,
    title: '상주 곶감 산지 직송',
    itemPrice: 8000,
    eupMyeonDong: '자양 1동',
    itemImageURLs: ['https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg'],
    campaignStatus: 'DISTRIBUTING',
    participatedPersonCnt: 5,
    hostName: '지운',

    tags: [],
    description: '',
    siDo: '서울시',
    siGunGu: '광진구',
    detailAddress: '',
    deadLine: '2019-01-01',
    totalOrderedItemCnt: 5,
    pageLinkUrl: '',
    maxQuantityPerPerson: 0,
    minQuantityPerPerson: 0,
    hostId: 1,
    campaignCategory: 'FOOD',
    chatRoomName: '',
    chatRoomParticipatedPersonCnt: 10,
  },

];

const pageSize = 20;

export function CampaignList({ navigation }) {
  const [currentLocation, setLocation] = useRecoilState(location);
  const accessToken = useRecoilState(userAccessToken)[0];
  // const [campaignList, setCampaignList] = useState<CampaignListData[] | null>(null); // TODO
  // const [page, setPage] = useState(0); // TODO
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // useLayoutEffect(() => {
  //   loadCampaignData();
  // }, []);
  useEffect(() => {
    loadCampaignData();
  }, []);
  useEffect(() => {
    console.log(accessToken);
  }, []);

  const loadCampaignData = async () => {
    if (campaignList.length >= page * pageSize) {
      try {
        setLoading(true);
        const url = `${Config.API_URL}/campaign/findAll?size=${pageSize}&page=${page}&sort=createdDate&direction=DESC&title=''&siDo=${currentLocation.siDo}&siGunGu=${currentLocation.siGunGu}`;
        const response = await axios.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        console.log(response);
        console.log(response.data.data);
        if (response.status === 200 && response.data.data.numberOfElements > 0) {
          // setPage((prev) => prev + 1);
          // setCampaignList();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onEndReached = () => {
    if (!loading) {
      loadCampaignData();
    }
  };

  const renderItem = ({ item }: { item: CampaignListData }) => (
    <EachCampaign item={item}/>
  );

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
      // onEndReached={onEndReached}
      // onEndReachedThreshold={0.6}
      // ListFooterComponent={loading && <ActivityIndicator />}
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
    flex: 1,
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
