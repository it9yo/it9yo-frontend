import React, { useLayoutEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';

import { SliderBox } from 'react-native-image-slider-box';

import { CampaignData } from '@src/@types';

import StatusNameList from '@constants/statusname';
import BottomNav from '@src/components/Campaign/BottomNav';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function DetailHome({ navigation, route }) {
  const { campaignId } = route.params;
  const screenWidth = Dimensions.get('screen').width;

  const accessToken = useRecoilState(userAccessToken)[0];
  const [campaignDetail, setCampaignDetail] = useState<CampaignData | undefined>();

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
                  fontSize: 15, fontWeight: '600', color: 'orange', marginBottom: 5,
                }}>
                  {`${campaignDetail.participatedPersonCnt}명 참여중`}
                </Text>
                <Text style={{
                  fontSize: 15, fontWeight: '600', color: 'black',
                }}>
                  {`${campaignDetail.deadLine} 마감`}
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
                <Pressable
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => navigation.navigate('ViewLocation', { campaignDetail })}
                >
                  <Icon name="location-outline" size={15} color="#000" />
                  <Text style={{
                    fontWeight: '600', fontSize: 13, color: 'black',
                  }}>
                    지도보기
                  </Text>
                </Pressable>
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
                  <View key={tag} style={styles.tag}>
                    <Text style={{ color: 'black', fontSize: 16 }}># {tag}</Text>
                  </View>))}
              </View>
            </View>

          </View>
          </ScrollView>

          <BottomNav
            campaignDetail={campaignDetail}
            setCampaignDetail={setCampaignDetail}
          />

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

export default DetailHome;
