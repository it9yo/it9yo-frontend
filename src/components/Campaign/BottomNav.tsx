import { CampaignData } from '@src/@types';
import React, { useEffect, useState } from 'react';
import {
  Alert, Image, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';

import Heart from '@assets/images/heart.png';
import HeartOutline from '@assets/images/heartOutline.png';
import Message from '@assets/images/message.png';

import { useNavigation } from '@react-navigation/native';
import JoinButton from './JoinButton';
import CancelButton from './CancelButton';
import ReceiveButton from './ReceiveButton';
import ManageButton from './ManageButton';
import ReviewButton from './ReviewButton';

interface BottomNavProps {
  campaignDetail: CampaignData;
  setRefresh: any;
}

function BottomNav({ campaignDetail, setRefresh }: BottomNavProps) {
  const navigation = useNavigation();

  const {
    hostId, campaignId, title, campaignStatus,
  } = campaignDetail;
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const [isHost, setHost] = useState(false);
  const [inCampaign, setInCampaign] = useState(false);

  const [isWish, setWish] = useState(false);

  useEffect(() => {
    const setInfo = async () => {
      if (userInfo.userId === hostId) {
        setHost(true);
      } else {
        const isInCampaign = await axios.get(
          `${Config.API_URL}/campaign/join/in/${campaignId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setInCampaign(isInCampaign.data.data);
      }
    };

    setInfo();
  }, []);

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
        if (error.response.data.code === 'wishNotFoundException') return;
        console.error(error);
      }
    };

    checkInWish();
  }, []);

  const handleWish = async () => {
    try {
      const url = isWish ? `${Config.API_URL}/campaign/wish/cancel/${campaignId}` : `${Config.API_URL}/campaign/wish/add/${campaignId}`;
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        console.log(response);
        if (!isWish) {
          Alert.alert('알림', '찜 목록 추가가 완료되었습니다.');
        } else {
          Alert.alert('알림', '찜 목록에서 삭제되었습니다.');
        }
        setWish((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <View style={styles.navContainer}>

    {/* 찜하기 버튼 */}
    <View style={styles.navUtilButton}>
      <TouchableOpacity onPress={handleWish}>
        {isWish
          ? <Image style={{ width: 32, height: 32 }} source={Heart} />
          : <Image style={styles.icon} source={HeartOutline} />
        }
      </TouchableOpacity>
    </View>
    {(isHost || inCampaign)
      && <View style={{
        ...styles.navUtilButton,
        borderLeftWidth: 1,
        borderColor: '#d4d4d4',
      }}>
        <TouchableOpacity onPress={() => navigation.navigate('ChatRoom', { campaignId, title })}>
          <Image style={styles.icon} source={Message} />
        </TouchableOpacity>
      </View>
    }

    {isHost
      && <ManageButton campaignDetail={campaignDetail} />}

    {!isHost && !inCampaign
      && <JoinButton
      campaignDetail={campaignDetail}
      setRefresh={setRefresh}/>}

    {!isHost && inCampaign && campaignStatus === 'RECRUITING'
      && <CancelButton
      campaignDetail={campaignDetail}
      setRefresh={setRefresh}/>}

    {!isHost && inCampaign && campaignStatus === 'DISTRIBUTING'
      && <ReceiveButton
      campaignDetail={campaignDetail}
      setRefresh={setRefresh}/>}

    {!isHost && inCampaign && campaignStatus === 'COMPLETED'
      && <ReviewButton campaignDetail={campaignDetail} />}

  </View>;
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
  },
  navUtilButton: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
});

export default BottomNav;
