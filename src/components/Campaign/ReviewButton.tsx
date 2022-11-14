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
  type?: string;
}

function ReviewButton({ campaignDetail, type }: ButtonParams) {
  const { campaignId } = campaignDetail;
  const accessToken = useRecoilState(userAccessToken)[0];

  const onCancelCampaign = async () => {
    try {
      // const response = await axios.post(
      //   `${Config.API_URL}/campaign/join/cancel/${campaignId}`,
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   },
      // );
      // if (response.status === 200) {
      //   Alert.alert('알림', '캠페인 취소가 완료되었습니다.');
      // TODO: 새로고침 되도록
      // navigation.navigate('CampaignDetail', {
      //   screen: 'DetailHome',
      //   params: { campaignId },
      // });
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return <TouchableOpacity
    style={type === 'middle' ? styles.middleButton : styles.button}
    onPress={onCancelCampaign}>
    <Text style={styles.buttonText}>후기작성</Text>
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

export default ReviewButton;
