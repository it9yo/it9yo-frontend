import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { CampaignData } from '@src/@types';
import { useNavigation } from '@react-navigation/native';

interface ButtonParams {
  campaignDetail: CampaignData;
  type?: string;
}

function ManageButton({ campaignDetail, type }: ButtonParams) {
  const naivgation = useNavigation();
  const { campaignId } = campaignDetail;

  return <TouchableOpacity
    style={type === 'middle' ? styles.middleButton : styles.button}>
    <Text style={styles.buttonText}>관리</Text>
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

export default ManageButton;
