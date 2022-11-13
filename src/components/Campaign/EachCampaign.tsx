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
    onPress={() => navigation.navigate('CampaignDetail', {
      screen: 'DetailHome',
      params: { campaignId },
    })}>
    <View style={styles.campaignListZone}>
      <Image style={styles.campaignThumbnail}
        source={{ uri: itemImageURLs[0] }}
      />

      <View style={{ flex: 1 }}>
        <View style={styles.topInfoZone}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{StatusNameList[campaignStatus]}</Text>
          </View>

          <Text style={styles.userCntText}>{`${participatedPersonCnt}명 참여중`}</Text>
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
    </View>

    <View style={styles.horizonLine} />
  </Pressable>;
}

export default EachCampaign;

const styles = StyleSheet.create({
  campaignListZone: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  campaignThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  topInfoZone: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 17,
    backgroundColor: '#fae5d2',
  },
  statusText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#e27919',
  },
  campaignTitleText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 4,
  },
  hostInfoZone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userIcon: {
    width: 14,
    height: 14,
    opacity: 0.7,
  },
  hostNameZone: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#828282',
    marginLeft: 3,
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
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
  },
  userCntText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
  },
  horizonLine: {
    width: Dimensions.get('window').width - 40,
    height: 1,
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
  },
});
