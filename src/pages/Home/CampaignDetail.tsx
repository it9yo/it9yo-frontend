import React, { useEffect, useLayoutEffect } from 'react';
import {
  View, Text, Pressable, SafeAreaView, StyleSheet, ScrollView, Dimensions, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';
import { SliderBox } from 'react-native-image-slider-box';

import { CampaignDetailData } from '@src/@types';

import StatusNameList from '@constants/statusname';

const campaignDetaildata: CampaignDetailData = {
  campaignId: 1,
  title: '상주 곶감',
  tags: ['곶감', '상주', '달달'],
  description: `맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!
  맛있는 상주 곶감!`,
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
    <ScrollView style={{ height: '100%' }}>

      <View style={styles.mainContentZone}>
        <View style={styles.itemImageZone}>
          <SliderBox
            images={campaignDetaildata.itemImageURLs}
            ImageComponentStyle={{
              height: 200,
              borderRadius: 30,
            }}
            circleLoop
            parentWidth={Number(screenWidth) - 60}
          />
        </View>

        <View style={styles.campaignDetailZone}>
          <Text style={styles.campaignTitleText}>
            {campaignDetaildata.title}
          </Text>
          <View style={styles.campaignStatusZone}>
            <Text style={{
              fontWeight: '600', fontSize: 15, color: 'red', marginBottom: 5,
            }}>
              {StatusNameList[campaignDetaildata.campaignStatus]}
            </Text>
            <Text style={{ fontWeight: '600', fontSize: 15, color: 'orange' }}>
              {`${campaignDetaildata.participatedPersonCnt}명 참여중`}
            </Text>
          </View>
        </View>

        <View style={styles.campaignInfoZone}>
          <View style={styles.campaignLocationDetailZone}>
            <Text style={{
              fontWeight: '600', fontSize: 13, color: 'orange', marginBottom: 5, paddingLeft: 10,
            }}>
              {campaignDetaildata.eupMyeonDong}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="location-outline" size={15} color="#000" />
              <Text style={{
                fontWeight: '600', fontSize: 13, color: 'black',
              }}>
                지도보기
              </Text>
            </View>
          </View>
          <View style={styles.campaignHostDetailZone}>
            <Icon name="person-outline" size={15} color="#000" />
            <Text style={{
              fontWeight: '600', fontSize: 15, color: 'orange', marginLeft: 2,
            }}>
              {campaignDetaildata.hostName}
            </Text>
          </View>
        </View>

        <View style={styles.campaignInfoZone}>
          <Text style={{
            position: 'absolute', right: 30, fontWeight: '500', fontSize: 24, color: 'black',
          }}>
            {`${numberWithCommas(campaignDetaildata.itemPrice)}원`}
          </Text>
        </View>

        <View style={styles.campaignDescribeZone}>
          <Text style={{ fontSize: 18, color: 'black' }}>
            {campaignDetaildata.description}
          </Text>
          <View style={styles.tagZone}>
            {campaignDetaildata.tags.map((tag) => (
              <View style={styles.tag}>
                <Text style={{ fontSize: 16 }}># {tag}</Text>
              </View>))}
          </View>
        </View>

      </View>
      </ScrollView>
      <View style={styles.navContainer}>
        <View style={styles.navButtonZone}>
          <Icon name="heart-outline" size={30} color="#000" style={{ marginTop: 5 }} />
          <Icon name="share-outline" size={28} color="#000" style={{ marginTop: 5, marginLeft: 8 }} />
          <View style={styles.buttonZone}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>공동구매 참여하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  mainContentZone: {
    width: Dimensions.get('screen').width - 30,
    borderColor: 'black',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 50,
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
  campaignDetailZone: {
    height: 56,
    justifyContent: 'center',
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'gray',
  },
  campaignInfoZone: {
    height: 50,
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
  campaignLocationDetailZone: {
    alignItems: 'flex-start',
    position: 'absolute',
    left: 30,
  },
  campaignHostDetailZone: {
    flexDirection: 'row',
    position: 'absolute',
    right: 40,
  },
  campaignDescribeZone: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    minHeight: 150,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: 'gray',
    marginBottom: 10,
  },
  tagZone: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tag: {
    color: 'white',
    backgroundColor: 'orange',
    marginLeft: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 30,
  },
  navContainer: {
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 25,
    paddingBottom: 45,
    paddingHorizontal: 25,
  },
  navButtonZone: {
    flexDirection: 'row',
  },
  buttonZone: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginHorizontal: 10,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 60,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CampaignDetail;
