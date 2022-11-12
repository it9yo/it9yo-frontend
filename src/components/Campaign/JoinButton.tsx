import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import BottomSheet from './BottomSheet';

interface ButtonParams {
  campaignDetail: CampaignData;
  type?: string;
}

function JoinButton({ campaignDetail, type }: ButtonParams) {
  const { campaignId } = campaignDetail;
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const accessToken = useRecoilState(userAccessToken)[0];
  const [modalVisible, setModalVisible] = useState(false);

  const onJoinCampaign = async (quantity: number) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/join/${campaignId}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        const changedUserInfo = await axios.get(
          `${Config.API_URL}/user/detail`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setUserInfo(changedUserInfo.data.data);
        Alert.alert('알림', '캠페인 참여가 완료되었습니다.');
        // initChat(campaignId);
        const text = `${userInfo.nickName}님이 캠페인에 참여하셨습니다.`;
        sendMessage(text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (text: string) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/chat/publish/${campaignId}`,
        {
          content: text,
          userChat: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  // const initChat = (id: number) => {
  //   try {
  //     const initMsg: IMessage[] = [{
  //       _id: 0,
  //       text: `${userInfo.nickName}님이 캠페인에 참여하셨습니다.`,
  //       createdAt: new Date(),
  //       user: {
  //         _id: 0,
  //         name: 'React Native',
  //       },
  //       system: true,
  //     }];
  //     AsyncStorage.setItem(`chatMessages_${id}`, JSON.stringify(initMsg));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return <>
    <TouchableOpacity style={type === 'middle' ? styles.middleButton : styles.button} onPress={() => setModalVisible(true)}>
      <Text style={styles.buttonText}>참가하기</Text>
    </TouchableOpacity>

    <BottomSheet
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      campaignDetail={campaignDetail}
      onJoinCampaign={onJoinCampaign}
    />
  </>;
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

export default JoinButton;
