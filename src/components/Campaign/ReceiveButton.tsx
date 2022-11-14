import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';

interface ButtonParams {
  campaignDetail: CampaignData;
  setRefresh: any;
  type?: string;
}

function ReceiveButton({ campaignDetail, setRefresh, type }: ButtonParams) {
  const { campaignId } = campaignDetail;
  const accessToken = useRecoilState(userAccessToken)[0];

  const onReceive = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/join/receive/${campaignId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        Alert.alert('알림', '물품 수령이 완료되었습니다.');
        setRefresh(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <TouchableOpacity
    style={type === 'middle' ? styles.middleButton : styles.button}
    onPress={onReceive}>
    <Text style={styles.buttonText}>수령하기</Text>
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

export default ReceiveButton;
