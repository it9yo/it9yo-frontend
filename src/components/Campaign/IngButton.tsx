import { useNavigation } from '@react-navigation/native';
import StatusNameList from '@src/constants/statusname';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import React from 'react';
import {
  Alert,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';

interface ButtonParams {
  status: string;
  campaignId: number;
  title: string;
  sendMessage: any;
}

function IngButton({
  status, campaignId, title, sendMessage,
}: ButtonParams) {
  const navigation = useNavigation();
  const accessToken = useRecoilState(userAccessToken)[0];

  const onCancelCampaign = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/join/cancel/${campaignId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        Alert.alert('알림', '캠페인 취소가 완료되었습니다.');
        // TODO: 새로고침 되도록
        // navigation.navigate('CampaignDetail', {
        //   screen: 'DetailHome',
        //   params: { campaignId },
        // });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <Text style={{ fontSize: 18, marginRight: 10 }}>
      {status === 'RECRUITING' ? '참여중' : StatusNameList[status]}
    </Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChatRoom', { campaignId, title })}>
      <Icon name="ios-chatbubble-ellipses-outline" size={28} color="white" />
    </TouchableOpacity>
    {status === 'RECRUITING' && (<TouchableOpacity style={styles.button} onPress={onCancelCampaign}>
      <Text style={styles.buttonText}>취소하기</Text>
    </TouchableOpacity>)
    }
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
});

export default IngButton;
