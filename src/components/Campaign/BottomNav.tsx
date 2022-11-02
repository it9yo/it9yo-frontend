import { CampaignData } from '@src/@types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import Config from 'react-native-config';
import axios from 'axios';
import BottomNavButton from './BottomNavButton';

interface BottomNavProps {
  campaignDetail: CampaignData;
  setCampaignDetail: any;
}

function BottomNav({ campaignDetail, setCampaignDetail }: BottomNavProps) {
  const { hostId, campaignId } = campaignDetail;
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const [isWish, setisWish] = useState(false);

  useEffect(() => {

  }, []);

  const handleWish = async () => {

  };

  return <View style={styles.navContainer}>
  <View style={{
    flex: 1, flexDirection: 'row', justifyContent: 'space-evenly',
  }}>

    {/* 찜하기 버튼 */}
    <TouchableOpacity onPress={handleWish}>
      <Icon name="heart-outline" size={32} color="#000" />
    </TouchableOpacity>

    {/* 공유하기 버튼 */}
    <Icon name="share-outline" size={30} color="#000" />
  </View>

   <BottomNavButton
    campaignDetail={campaignDetail}
    setCampaignDetail={setCampaignDetail}
  />
</View>;
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    // alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 30,
    // paddingHorizontal: 25,
  },
});

export default BottomNav;
