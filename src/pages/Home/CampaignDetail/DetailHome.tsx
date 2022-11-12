import React, { useLayoutEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Pressable, Image,
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

import GPSIcon from '@assets/images/gps.png';

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

            <SliderBox
              images={campaignDetail.itemImageURLs}
              ImageComponentStyle={{
                height: 320,
              }}
              circleLoop
            />

          <View style={styles.infoBlock}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.badge}>
                <Text style={styles.statusText}>
                  {StatusNameList[campaignDetail.campaignStatus]}
                </Text>
              </View>
              <Text style={styles.peopleText}>
                {`${campaignDetail.participatedPersonCnt}명 참여중`}
              </Text>
            </View>

            <Text style={styles.titleText}>
              {campaignDetail.title}
            </Text>

            <View style={styles.locationInfo}>
              <Image style={styles.infoIcon} source={GPSIcon} />

              <Text style={styles.addressText}>{campaignDetail.eupMyeonDong}</Text>

              <Pressable onPress={() => navigation.navigate('ViewLocation', { campaignDetail })}>
                <Text style={StyleSheet.compose(styles.addressText, { color: '#306fe1' })}>
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
    backgroundColor: '#fff',
    marginBottom: 100,
  },
  infoBlock: {
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
    backgroundColor: '#fae5d2',
  },
  statusText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: '#e27919',
  },
  peopleText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
  },
  titleText: {
    marginTop: 10,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 28.8,
    letterSpacing: -0.48,
    color: '#121212',
  },
  locationInfo: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  addressText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#1f1f1f',
    marginLeft: 6,
  },
  rightArrow: {
    width: 15,
    height: 15,
    opacity: 0.4,
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
