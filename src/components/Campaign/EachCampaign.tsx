import React, { useEffect } from 'react';
import {
  View, Image, Text, StyleSheet, Pressable, Platform, Dimensions,
} from 'react-native';

import StatusNameList from '@constants/statusname';
import Icon from 'react-native-vector-icons/Ionicons';
import { CampaignData } from '@src/@types';
import { useNavigation } from '@react-navigation/native';

import UserIcon from '@assets/images/user.png';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function EachCampaign({ item }: { item: CampaignData }) {
  const navigation = useNavigation();
  const {
    campaignId, title, eupMyeonDong, itemImageURLs,
    campaignStatus, hostNickName, participatedPersonCnt, itemPrice,
  } = item;

  return <Pressable
    style={{ justifyContent: 'center' }}
    onPress={() => navigation.navigate('CampaignDetail', {
      screen: 'DetailHome',
      params: { campaignId },
    })}>

    <View style={styles.campaignListZone}>
      <Image style={styles.campaignThumbnail}
        source={{
          uri: itemImageURLs[0] || 'https://www.tibs.org.tw/images/default.jpg',
        }}
      />

      <View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{StatusNameList[campaignStatus]}</Text>
        </View>
        <Text style={styles.campaignTitleText}>{title}</Text>

        <View style={styles.hostInfoZone}>
          <Image style={styles.userIcon} source={UserIcon} />
          <Text style={styles.hostNameZone}>{hostNickName}</Text>
          <View style={styles.ellipse} />
          <Text style={styles.hostNameZone}>{eupMyeonDong}</Text>
        </View>

        <Text style={styles.priceText}>{`${numberWithCommas(itemPrice)} 원`}</Text>
      </View>

      <View style={styles.chatStateView}>
        <Text style={styles.userCntText}>{`${participatedPersonCnt}명 참여중`}</Text>
      </View>

    </View>

    <View style={styles.horizonLine} />

  </Pressable>;
}

export default EachCampaign;

const styles = StyleSheet.create({
  campaignListZone: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  campaignThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  statusBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
    height: 20,
    borderRadius: 17,
    backgroundColor: '#fae5d2',
  },
  statusText: {
    width: 34,
    height: 18,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#e27919',
  },
  campaignTitleText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#282828',
  },
  hostInfoZone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userIcon: {
    width: 12,
    height: 12,
    opacity: 0.7,
  },
  hostNameZone: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#828282',
  },
  ellipse: {
    width: 3,
    height: 3,
    marginHorizontal: 3,
    borderRadius: 1.5,
    backgroundColor: '#ababab',
  },
  priceText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#282828',
  },
  chatStateView: {
    alignItems: 'flex-end',
    fontFamily: 'Proxima Nova',
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 14,
  },
  userCntText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#282828',
  },
  horizonLine: {
    width: Dimensions.get('window').width - 40,
    height: 1,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
  },
});
