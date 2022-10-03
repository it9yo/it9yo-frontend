import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';

import StatusNameList from '@constants/statusname';
import Icon from 'react-native-vector-icons/Ionicons';
import { CampaignListData } from '@src/@types';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function EachCampaign({ item }: { item: CampaignListData }) {
  const {
    campaignTitle, campaignLocation, campaignThumbnailUrl,
    campaignStatus, hostName, participatedPersonCnt, itemPrice,
  } = item;

  return <View style={styles.campaignListZone}>
      <Image style={styles.campaignThumbnail}
        source={{
          uri: campaignThumbnailUrl,
        }}
      />
      <View>
        <Text style={styles.campaignTitleText}>{campaignTitle}</Text>
        <View style={styles.hostInfoZone}>
          <Icon name="person-outline" size={16} color="#000" />
          <Text style={styles.hostNameZone}>{hostName}</Text>
        </View>
        <Text style={styles.priceText}>{`${numberWithCommas(itemPrice)} 원`}</Text>
      </View>
      <View style={styles.chatStateView}>
        <Text style={styles.statusText}>{StatusNameList[campaignStatus]}</Text>
        <Text style={styles.userCntText}>{campaignLocation}</Text>
        <Text style={styles.userCntText}>{`${participatedPersonCnt}명 참여중`}</Text>
      </View>
    </View>;
}

export default EachCampaign;

const styles = StyleSheet.create({
  campaignListZone: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  campaignThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 80 / 2,
    marginRight: 10,
  },
  campaignTitleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
  hostInfoZone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  hostNameZone: {
    color: 'orange',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 2,
  },
  priceText: {
    fontWeight: '700',
    fontSize: 24,
    color: 'black',
  },
  chatStateView: {
    alignItems: 'flex-end',
    fontFamily: 'Proxima Nova',
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 14,
  },
  statusText: {
    color: 'red',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 8,
  },
  userCntText: {
    color: 'orange',
    fontWeight: '600',
    fontSize: 16,
    paddingTop: 5,
  },
});
