import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';
import { SliderBox } from 'react-native-image-slider-box';

import { CampaignData } from '@src/@types';

import StatusNameList from '@constants/statusname';

// const campaignDetail: CampaignData = {
//   campaignId: 1,
//   title: '상주 곶감',
//   tags: ['곶감', '상주', '달달'],
//   description: `맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!
//   맛있는 상주 곶감!`,
//   itemPrice: 1000,
//   itemImageURLs: ['https://cdn.kbmaeil.com/news/photo/202001/835750_854186_5024.jpg', 'https://uyjoqvxyzgvv9714092.cdn.ntruss.com/data2/content/image/2020/11/19/20201119299991.jpg'],
//   siDo: '서울시',
//   siGunGu: '광진구',
//   eupMyeonDong: '구의동',
//   detailAddress: '구의동 10-10',
//   deadLine: '2017-03-04',
//   campaignStatus: 'RECRUITING',
//   participatedPersonCnt: 0,
//   totalOrderedItemCnt: 0,
//   pageLinkUrl: '4735f881-ca32-4881-adf7-5f1e02bd43f2',
//   maxQuantityPerPerson: 10,
//   minQuantityPerPerson: 5,
//   hostId: 6,
//   hostNickName: '지운',
//   campaignCategory: 'FOOD',
// };

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function CampaignDetail({ navigation, route }) {
  const { campaignId } = route.params;
  const accessToken = useRecoilState(userAccessToken)[0];
  const screenWidth = Dimensions.get('screen').width;
  const [campaignDetail, setCampaignDetail] = useState<CampaignData | undefined>();

  useEffect(() => {
    console.log(campaignDetail);
  }, [campaignDetail]);

  useLayoutEffect(() => {
    const loadCampaignDetail = async () => {
      try {
        const response = await axios.get(
          `${Config.API_URL}/campaign/detail/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.status === 200) {
          setCampaignDetail(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadCampaignDetail();
  }, []);

  if (campaignDetail) {
    return (
      <SafeAreaView>
        <ScrollView style={styles.container}>
          <View style={styles.mainContent}>

            <View style={styles.imageBlock}>
              <SliderBox
                images={campaignDetail.itemImageURLs}
                ImageComponentStyle={{
                  height: 200,
                  borderRadius: 30,
                }}
                circleLoop
                parentWidth={Number(screenWidth) - 60}
              />
            </View>

            <View style={styles.horizenLine} />

            <View style={styles.contentBlock}>
              <Text style={{ color: 'black', fontSize: 22, fontWeight: '400' }}>
                {campaignDetail.title}
              </Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  fontSize: 15, fontWeight: '600', color: 'red', marginBottom: 5,
                }}>
                  {StatusNameList[campaignDetail.campaignStatus]}
                </Text>
                <Text style={{
                  fontSize: 15, fontWeight: '600', color: 'orange',
                }}>
                  {`${campaignDetail.participatedPersonCnt}명 참여중`}
                </Text>
              </View>
            </View>

            <View style={styles.horizenLine} />

            <View style={styles.contentBlock}>
              <View>
                <Text style={{
                  fontWeight: '600', fontSize: 13, color: 'orange', marginBottom: 5, paddingLeft: 10,
                }}>
                  {campaignDetail.eupMyeonDong}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="person-outline" size={15} color="#000" />
                <Text style={{
                  fontWeight: '600', fontSize: 15, color: 'orange', marginLeft: 2,
                }}>
                  {campaignDetail.hostNickName}
                </Text>
              </View>
            </View>

            <View style={styles.horizenLine} />

            <View style={{
              paddingVertical: 10,
              paddingHorizontal: 25,
              alignItems: 'flex-end',
            }}>
              <Text style={{
                fontWeight: '500', fontSize: 30, color: 'black',
              }}>
                {`${numberWithCommas(campaignDetail.itemPrice)}원`}
              </Text>
            </View>

            <View style={styles.horizenLine} />

            <View style={{
              paddingVertical: 10,
              paddingHorizontal: 25,
            }}>
              <Text style={{ color: 'black', fontSize: 18 }}>
                {campaignDetail.description}
              </Text>
              <View style={styles.tagZone}>
                {campaignDetail.tags.map((tag) => (
                  <View style={styles.tag}>
                    <Text style={{ color: 'black', fontSize: 16 }}># {tag}</Text>
                  </View>))}
              </View>
            </View>

          </View>
          </ScrollView>

          <View style={styles.navContainer}>
            <View style={{
              flex: 1, flexDirection: 'row', justifyContent: 'space-evenly',
            }}>
              <Icon name="heart-outline" size={32} color="#000" />
              <Icon name="share-outline" size={30} color="#000" />
            </View>
            <View style={{
              flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
            }}>

              {/* 참여 전 */}
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>        공동구매 참여하기        </Text>
              </TouchableOpacity>

              {/* 참여 중 */}
              {/* <Text style={{ fontSize: 18, marginRight: 10 }}>현재 참여중</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>참여 취소하기</Text>
              </TouchableOpacity> */}

              {/* 확정 ~ 수령완료 */}
              {/* <TouchableOpacity style={styles.button}>
                <Icon name="ios-chatbubble-ellipses-outline" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>     수령 완료하기     </Text>
              </TouchableOpacity> */}

              {/* 완료 후 */}
              {/* <TouchableOpacity style={styles.button}>
                <Icon style={{ marginHorizontal: 5 }} name="ios-chatbubble-ellipses-outline" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>후기 작성</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>신고</Text>
              </TouchableOpacity> */}

            </View>
          </View>
      </SafeAreaView>);
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
  mainContent: {
    width: Dimensions.get('screen').width - 30,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 60,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
  },
  imageBlock: {
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  contentBlock: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizenLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  tagZone: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tag: {
    backgroundColor: 'orange',
    borderRadius: 30,
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  navContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    // alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 30,
    // paddingHorizontal: 25,
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
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CampaignDetail;
