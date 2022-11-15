import React, { useState } from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';

import StatusNameList from '@constants/statusname';
import { JoinUserInfo } from '@src/@types';

import Icon from 'react-native-vector-icons/AntDesign';

interface EachUserProps {
  item: JoinUserInfo;
  campaignStatus?: string;
  itemPrice?: number;
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function EachUser({ item, campaignStatus, itemPrice } : EachUserProps) {
  const {
    userId, nickName, quantity, receiveStatus, deposit, profileImage,
  } = item;

  return <View style={styles.container}>
    <View style={styles.leftContainer}>
      <Image style={styles.image} source={{ uri: profileImage }} />
      <Text style={styles.infoText}>{nickName}</Text>
      {deposit === true
        ? <View style={{ ...styles.depositStatusBadge, backgroundColor: '#ff9e3e' }}>
        <Text style={{ ...styles.depositStatusText, color: 'white' }}>입금완료</Text>
      </View>
        : <View style={styles.depositStatusBadge}>
        <Text style={styles.depositStatusText}>입금대기</Text>
      </View>
      }
      <Icon name='swap' size={20} color="#adb7cb"/>
    </View>
    {itemPrice
      ? <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{numberWithCommas(itemPrice * quantity)}원 / {quantity}개</Text>
      : <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{quantity}개</Text>}

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
