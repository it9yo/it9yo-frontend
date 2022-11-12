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
import HostIcon from '@assets/images/host.png';
import JoinButton from '@src/components/Campaign/JoinButton';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function DetailHome({ navigation, route }) {
  const { campaignId } = route.params;

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

          {/* 제목 및 정보 */}
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

            <View style={styles.hostInfoZone}>
              <Image style={styles.infoIcon} source={GPSIcon} />

              <Text style={styles.hostInfoText}>{campaignDetail.eupMyeonDong}</Text>

              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => navigation.navigate('ViewLocation', { campaignDetail })}
              >
                <Text style={StyleSheet.compose(styles.hostInfoText, { color: '#306fe1', marginRight: 2 })}>
                  지도보기
                </Text>
                <Icon name='md-chevron-forward-sharp' size={20} color='#A7A7A8' />
              </Pressable>
            </View>

            <View style={styles.hostInfoZone}>
              <Image style={styles.infoIcon} source={HostIcon} />

              <Text style={styles.hostInfoText}>
                {campaignDetail.hostNickName}
              </Text>
            </View>
          </View>

          <View style={styles.horizenLine} />

          {/* 가격 및 참가하기 */}
          <View style={styles.infoBlock}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.priceText}>공동구매 가격</Text>
                <Text style={styles.price}>
                  {`${numberWithCommas(campaignDetail.itemPrice)}원`}
                </Text>
              </View>
              {/* TODO: 상태에 따라 버튼 변경 */}

              <JoinButton campaignDetail={campaignDetail} type="middle" />
            </View>
          </View>

          <View style={styles.horizenLine} />

          {/* 상품 설명 및 태그 */}
          <View style={styles.infoBlock}>
            <Text style={styles.contentText}>
              {campaignDetail.description}
            </Text>

            {campaignDetail.tags.length > 0
              && (<View style={styles.tagZone}>
              {campaignDetail.tags.map((tag, idx) => (
                <View key={idx.toString()} style={styles.tag}>
                  <Text style={{ color: '#fff', fontSize: 14 }}># {tag}</Text>
                </View>))}
            </View>)}
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
    marginBottom: 60,
  },
  infoBlock: {
    paddingVertical: 20,
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
    marginBottom: 20,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 28.8,
    letterSpacing: -0.48,
    color: '#121212',
  },
  hostInfoZone: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
  },
  hostInfoText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#1f1f1f',
    marginLeft: 6,
  },
  priceText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 15.6,
    letterSpacing: -0.13,
    color: '#828282',
    marginBottom: 5,
  },
  price: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 21.6,
    letterSpacing: -0.18,
    textAlign: 'left',
    color: '#121212',
  },
  contentText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 20,
  },
  tagZone: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'orange',
    borderRadius: 30,
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  horizenLine: {
    height: 6,
    backgroundColor: '#f6f6f6',
  },
});

export default DetailHome;
