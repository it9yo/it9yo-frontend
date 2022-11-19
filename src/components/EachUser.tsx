import React, { useEffect, useState } from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';

import { JoinUserInfo, CampaignData } from '@src/@types';

import Icon from 'react-native-vector-icons/AntDesign';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

interface EachUserProps {
  item: JoinUserInfo;
  campaignData: CampaignData;
  type?: string;
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function EachUser({ item, campaignData, type } : EachUserProps) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const {
    userId, nickName, quantity, receiveStatus, deposit, profileImage,
  } = item;
  const { campaignId, itemPrice, campaignStatus } = campaignData;

  const [isDeposit, setDeposit] = useState(deposit);

  useEffect(() => {
    console.log(item);
    console.log(campaignData);
  }, [item, campaignData]);

  const handleDeposit = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/join/deposit/v2/${campaignId}/${userId}/${!isDeposit}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        setDeposit((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (campaignStatus === 'DISTRIBUTING' || campaignStatus === 'COMPLETED') {
    return <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image style={styles.image} source={{ uri: profileImage }} />
        <Text style={styles.infoText}>{nickName}</Text>
        {receiveStatus !== 'NOT_RECEIVED'
        && <View style={styles.depositStatusBadge}>
          <Text style={styles.depositStatusText}>수령완료</Text>
        </View>}
      </View>
      {type !== 'drawer' && itemPrice && <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{numberWithCommas(itemPrice * quantity)}원 / {quantity}개</Text>}
      {type !== 'drawer' && !itemPrice && <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{quantity}개</Text>}
    </View>;
  }

  return <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image style={styles.image} source={{ uri: profileImage }} />
        <Text style={styles.infoText}>{nickName}</Text>
        {type !== 'drawer' && isDeposit
        && <View style={{ ...styles.depositStatusBadge, backgroundColor: '#ff9e3e' }}>
          <Text style={{ ...styles.depositStatusText, color: 'white' }}>입금완료</Text>
        </View>}
        {type !== 'drawer' && !isDeposit
        && <View style={styles.depositStatusBadge}>
          <Text style={styles.depositStatusText}>입금대기</Text>
        </View>}

        {type !== 'drawer'
          && <Pressable onPress={handleDeposit}>
            <Icon name='swap' size={20} color="#adb7cb"/>
          </Pressable>}
      </View>
      {type !== 'drawer' && itemPrice && <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{numberWithCommas(itemPrice * quantity)}원 / {quantity}개</Text>}
      {type !== 'drawer' && !itemPrice && <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{quantity}개</Text>}
    </View>;
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  infoText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#121212',
  },
  depositStatusBadge: {
    paddingHorizontal: 10,
    height: 20,
    borderRadius: 17,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  depositStatusText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ababab',
  },
});

export default EachUser;
