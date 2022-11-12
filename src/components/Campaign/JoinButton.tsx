import React, { useState } from 'react';
import {
  Alert,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import BottomSheet from './BottomSheet';

interface ButtonParams {
  campaignDetail: CampaignData;
  sendMessage: any;
}

function JoinButton({ campaignDetail, sendMessage }: ButtonParams) {
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

  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} >
      <Text style={styles.buttonText}>        공동구매 참여하기        </Text>
    </TouchableOpacity>

    <BottomSheet
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      campaignDetail={campaignDetail}
      onJoinCampaign={onJoinCampaign}
    />
  </View>;
}
const styles = StyleSheet.create({
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    // margin: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 500,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    height: 40,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 15,
  },
});

export default JoinButton;
