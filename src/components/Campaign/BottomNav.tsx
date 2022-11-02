import { CampaignData } from '@src/@types';
import React, { useEffect, useState } from 'react';
import {
  Alert, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';
import BottomNavButton from './BottomNavButton';

interface BottomNavProps {
  campaignDetail: CampaignData;
  setCampaignDetail: any;
}

function BottomNav({ campaignDetail, setCampaignDetail }: BottomNavProps) {
  const { hostId, campaignId } = campaignDetail;
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const [isWish, setWish] = useState(false);

  useEffect(() => {
    const checkInWish = async () => {
      try {
        const response = await axios.get(
          `${Config.API_URL}/campaign/wish/InWishes/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.status === 200) {
          const { data } = response.data;
          if (data === 'ok') {
            setWish(true);
          } else {
            setWish(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkInWish();
  }, []);

  const handleWish = async () => {
    if (!isWish) {
      // 찜하기
      try {
        const response = await axios.post(
          `${Config.API_URL}/campaign/wish/add/${campaignId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (response.status === 200) {
          console.log(response);
          Alert.alert('알림', '찜 목록 추가 완료되었습니다.');
          setWish(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // 찜 취소
      setWish(false);
    }
  };

  return <View style={styles.navContainer}>
  <View style={{
    flex: 1, flexDirection: 'row', justifyContent: 'space-evenly',
  }}>

    {/* 찜하기 버튼 */}
    <TouchableOpacity onPress={handleWish}>
      {isWish
        ? <Icon name="heart" size={32} color="#000" />
        : <Icon name="heart-outline" size={32} color="#000" />
      }
    </TouchableOpacity>

    {/* 공유하기 버튼 */}
    <Icon name="share-outline" size={30} color="#000" />
  </View>

   <BottomNavButton
    campaignDetail={campaignDetail}
    setCampaignDetail={setCampaignDetail}
  />
</View>;
}

const styles = StyleSheet.create({
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
});

export default BottomNav;
