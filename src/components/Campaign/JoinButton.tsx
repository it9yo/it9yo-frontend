import React, { useEffect, useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  userAccessToken, userState, locationState,
} from '@src/states';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from './BottomSheet';
import CompleteModal from './CompleteModal';

interface ButtonParams {
  campaignDetail: CampaignData;
  setRefresh: any;
  type?: string;
}

function JoinButton({ campaignDetail, setRefresh, type }: ButtonParams) {
  const navigation = useNavigation();
  const { campaignId } = campaignDetail;
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const currentLocation = useRecoilValue(locationState);
  const accessToken = useRecoilState(userAccessToken)[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

  useEffect(() => {
    console.log('in join button userInfo', userInfo);
  }, []);

  const onJoinCampaign = async (quantity: number) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/join/${campaignId}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        const changedUserInfo = await axios.get(
          `${Config.API_URL}/user/detail`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setUserInfo(changedUserInfo.data.data);
        setModalVisible(false);
        setCompleteModalVisible(true);

        const text = `${userInfo.nickName}님이 캠페인에 참여하셨습니다.`;
        sendMessage(text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (text: string) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/chat/publish/${campaignId}`,
        {
          content: text,
          userChat: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoin = () => {
    if (userInfo.locationAuth) {
      setModalVisible(true);
    } else {
      Alert.alert(
        '알림',
        '캠페인에 참여하시려면 지역 인증을 진행해 주세요',
        [
          {
            text: '네',
            onPress: () => navigation.navigate('LocCert', { currentLocation }),
          },
          {
            text: '아니요',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
  };

  return <>
    <TouchableOpacity style={type === 'middle' ? styles.middleButton : styles.button} onPress={handleJoin}>
      <Text style={styles.buttonText}>참가하기</Text>
    </TouchableOpacity>

    <BottomSheet
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      campaignDetail={campaignDetail}
      onJoinCampaign={onJoinCampaign}
    />
    <CompleteModal
      modalVisible={completeModalVisible}
      setModalVisible={setCompleteModalVisible}
      setRefresh={setRefresh}
    />
  </>;
}
const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9e3e',
  },
  middleButton: {
    width: 160,
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9e3e',
  },
  buttonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#f5f8fa',
  },
});

export default JoinButton;
