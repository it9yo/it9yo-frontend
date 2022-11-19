import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import { useNavigation } from '@react-navigation/native';

interface ButtonParams {
  campaignDetail: CampaignData;
  type?: string;
}

function ReviewButton({ campaignDetail, type }: ButtonParams) {
  const navigation = useNavigation();
  const { campaignId, campaignStatus } = campaignDetail;
  const accessToken = useRecoilState(userAccessToken)[0];
  const buttonActive = campaignStatus === 'DISTRIBUTING';

  return <TouchableOpacity
    style={type === 'middle' ? styles.middleButton : styles.button}
    onPress={() => navigation.navigate('CreateReview', { ...campaignDetail })}>
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
