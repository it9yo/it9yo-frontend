import React, { useEffect, useLayoutEffect } from 'react';
import {
  View, Text, Pressable, SafeAreaView, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';
import { SliderBox } from 'react-native-image-slider-box';

import { CampaignDetailData } from '@src/@types';

import StatusNameList from '@constants/statusname';

const campaginDetaildata: CampaignDetailData = {
  campaignId: 1,
  title: '상주 곶감',
  tags: ['곶감', '상주', '달달'],
  description: '맛있는 상주 곶감!',
  itemPrice: 1000,
  itemImageURLs: ['https://cdn.kbmaeil.com/news/photo/202001/835750_854186_5024.jpg', 'https://uyjoqvxyzgvv9714092.cdn.ntruss.com/data2/content/image/2020/11/19/20201119299991.jpg'],
  siDo: '서울시',
  siGunGu: '광진구',
  detailAddress: '구의동 10-10',
  deadLine: '2017-03-04',
  campaignStatus: 'RECRUITING',
  participatedPersonCnt: 0,
  totalOrderedItemCnt: 0,
  pageLinkUrl: '4735f881-ca32-4881-adf7-5f1e02bd43f2',
  maxQuantityPerPerson: 10,
  minQuantityPerPerson: 5,
  hostId: 6,
  campaignCategory: 'FOOD',
  chatRoomId: 1,
};

function CampaignDetail({ navigation, route }) {
  const { campaignId } = route.params;
  const accessToken = useRecoilState(userAccessToken)[0];
  const screenWidth = Dimensions.get('screen').width;

  // useLayoutEffect(() => {
  //   const loadCampaignDetail = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${Config.API_URL}/campaign/detail/${campaignId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       );
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   loadCampaignDetail();
  // }, []);

  return <SafeAreaView style={styles.container}>
    <View style={styles.navContainer}>
      <Pressable style={styles.navButtonZone} onPress={() => navigation.pop()}>
        <Icon name="ios-chevron-back" size={24} color="#000" />
        <Text style={styles.locationText}>
          목록 가기
        </Text>
        </Pressable>
    </View>

    <ScrollView style={{ height: '200%' }}>

      <View style={styles.mainContentZone}>
        <View style={styles.itemImageZone}>
          <SliderBox
            images={campaginDetaildata.itemImageURLs}
            ImageComponentStyle={{
              height: 200,
              borderRadius: 30,
            }}
            onCurrentImagePressed={
              (index) => {
                console.log(`image pressed index : ${index}`); // console log index
              }
            }
            circleLoop // loop
            parentWidth={Number(screenWidth) - 60}
          />
        </View>
        <View style={styles.campaignTitleZone}>
          <Text style={styles.campaignTitleText}>{campaginDetaildata.title}</Text>
          <View style={styles.campaignStatusZone}>
            <Text style={{
              fontWeight: '600', fontSize: 15, color: 'red', marginBottom: 5,
            }}>
              {StatusNameList[campaginDetaildata.campaignStatus]}
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 15, color: 'orange' }}>
              {`${campaginDetaildata.participatedPersonCnt}명 참여중`}
            </Text>
          </View>
        </View>
        {/* <View style={styles.campaignInfoZone}>

        </View> */}
        {/* <View style={styles.campaignPriceZone}></View>
        <View style={styles.campaignDescriptionZone}></View> */}
        {/* <View style={styles.bottomNavContainer}></View> */}
      </View>
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
    paddingHorizontal: 20,
    height: 56,
  },
  navButtonZone: {
    position: 'absolute',
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontWeight: '400',
    fontSize: 25,
    marginLeft: 8,
  },
  locationZone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContentZone: {
    width: Dimensions.get('screen').width - 30,
    borderColor: 'black',
    // alignItems: 'center',
    marginHorizontal: 15,
  },
  itemImageZone: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    height: 220,
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'gray',
  },
  campaignTitleZone: {
    height: 56,
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'gray',
  },
  campaignTitleText: {
    fontSize: 22,
    fontWeight: '400',
    position: 'absolute',
    left: 20,
  },
  campaignStatusZone: {
    // fontSize: 22,
    // fontWeight: '400',
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
  },
});

export default CampaignDetail;
