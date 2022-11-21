import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import AsyncStorage from '@react-native-community/async-storage';

interface ButtonParams {
  campaignDetail: CampaignData;
  setRefresh: any;
  type?: string;
}

function CancelButton({ campaignDetail, setRefresh, type }: ButtonParams) {
  const { campaignId } = campaignDetail;
  const accessToken = useRecoilState(userAccessToken)[0];

  const handleCancle = () => {
    Alert.alert(
      '알림',
      '정말 캠페인을 취소하시겠습니까?',
      [
        {
          text: '네',
          onPress: async () => {
            const isChanged = await onCancelCampaign();
          },
        },
        {
          text: '아니요',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  const onCancelCampaign = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/join/cancel/${campaignId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        Alert.alert('알림', '캠페인 취소가 완료되었습니다.');

        deleteMessage();

        setRefresh(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async () => {
    const data = await AsyncStorage.getItem(`lastChat_${campaignId}`);
    if (data !== null) {
      const chatListData = JSON.parse(data);
      const { unread } = chatListData;
      if (unread !== 0) {
        const unreadData = await AsyncStorage.getItem('unreadAll');
        if (unreadData !== null) {
          const unreadAll = Number(unreadData);
          await AsyncStorage.setItem('unreadAll', String(unreadAll - unread));
        }
      }
    }

    const deleteKeys = [`chat_${campaignId}`, `lastChat_${campaignId}`];
    await AsyncStorage.multiRemove(deleteKeys);
  };

  return <TouchableOpacity
    style={type === 'middle' ? styles.middleButton : styles.button}
    onPress={handleCancle}>
    <Text style={styles.buttonText}>취소하기</Text>
  </TouchableOpacity>;
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

export default CancelButton;
