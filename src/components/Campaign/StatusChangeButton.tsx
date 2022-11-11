import React, { useEffect, useState } from 'react';
import {
  Alert, Modal, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import StatusNameList from '@constants/statusname';
import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import { useNavigation } from '@react-navigation/native';

interface BottomNavProps {
  campaignDetail: CampaignData;
  setCampaignDetail: any;
}

function StatusChangeButton({ campaignDetail, setCampaignDetail }: BottomNavProps) {
  const navigation = useNavigation();
  const { campaignId, campaignStatus, title } = campaignDetail;
  const accessToken = useRecoilState(userAccessToken)[0];

  const [modalVisible, setModalVisible] = useState(false);
  const [nextStatus, setNextStatus] = useState<string[]>([]);

  useEffect(() => {
    switch (campaignStatus) {
      case 'RECRUITING':
        setNextStatus(['CONFIRM']);
        break;
      case 'CONFIRM':
        setNextStatus(['DELIVERING']);
        break;
      case 'DELIVERING':
        setNextStatus(['DELIVERED']);
        break;
      case 'DELIVERED':
        setNextStatus(['DISTRIBUTING']);
        break;
      case 'DISTRIBUTING':
        setNextStatus(['COMPLETED']);
        break;
      default:
        break;
    }
  }, [campaignStatus]);

  const onChangeStatus = async (status: string) => {
    try {
      console.log(status);
      const response = await axios.post(
        `${Config.API_URL}/campaign/status/change/${campaignId}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        Alert.alert('알림', '캠페인 상태 변경이 완료되었습니다.');
        setCampaignDetail(response.data.data);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  const handleStatusChange = async (newStatus: string) => {
    Alert.alert(
      '알림',
      `정말 ${StatusNameList[campaignStatus]}에서 ${StatusNameList[newStatus]}(으)로 바꾸시겠습니까?`,
      [
        {
          text: '네',
          onPress: async () => {
            const isChanged = await onChangeStatus(newStatus);
            if (isChanged) {
              setModalVisible(false);
            }
          },
        },
        {
          text: '아니요',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  return <View style={{
    flex: 2, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingRight: 10,
  }}>
    <Text style={{ fontSize: 18, marginRight: 10 }}>{StatusNameList[campaignStatus]}</Text>

    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChatRoom', { campaignId, title })}>
      <Icon name="ios-chatbubble-ellipses-outline" size={28} color="white" />
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} >
      <Text style={styles.buttonText}>관리</Text>
    </TouchableOpacity>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {nextStatus.map((item) => (
            <View style={{ marginBottom: 8 }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleStatusChange(item)}
              >
                <Text style={styles.buttonText}>{StatusNameList[item]}(으)로 변경</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.buttonText}>캠페인 취소하기</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={{ fontSize: 18 }}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default StatusChangeButton;
