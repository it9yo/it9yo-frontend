import React, { useState } from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';

import StatusNameList from '@constants/statusname';
import { JoinUserInfo } from '@src/@types';

import ProfileIcon from '@assets/images/profile.png';
import CheckBox from '@react-native-community/checkbox';

interface EachUserProps {
  item: JoinUserInfo;
  campaignStatus: string;
  editable: boolean;
}
function EachUser({ item, campaignStatus, editable } : EachUserProps) {
  const {
    userId, nickName, quantity, receiveStatus, deposit,
  } = item;

  const [checked, setChecked] = useState(deposit);

  return <View style={styles.container}>
    <View style={styles.leftContainer}>
      {editable && <CheckBox
        tintColors={{
          true: '#ff9e3e',
        }}
        value={checked}
        onValueChange={(newValue) => {
          setChecked(newValue);
        }}/>
      }
      <Image style={styles.image} source={ProfileIcon} />
      <Text style={styles.infoText}>{nickName}</Text>
      <View style={styles.depositStatusBadge}>
        <Text style={styles.depositStatusText}>입금대기</Text>
      </View>
    </View>
    <Text style={{ ...styles.infoText, alignContent: 'flex-end' }}>{quantity}개</Text>

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
    borderWidth: 1,
    borderColor: 'black',
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
    marginLeft: 10,
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
