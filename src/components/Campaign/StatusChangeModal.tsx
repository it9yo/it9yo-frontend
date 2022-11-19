import React, { useEffect, useState } from 'react';
import {
  Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import StatusNameList from '@constants/statusname';
import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import CheckIcon from '@assets/images/check.png';

interface ButtonParams {
  campaignDetail: CampaignData;
  modalVisible: boolean;
  setModalVisible: any;
  setRefresh: any;
}

function StatusChangeModal({
  campaignDetail, modalVisible, setModalVisible, setRefresh,
}: ButtonParams) {
  const { campaignId, campaignStatus } = campaignDetail;
  const accessToken = useRecoilState(userAccessToken)[0];

  const [nextStatus, setNextStatus] = useState(campaignStatus);

  const onChangeStatus = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/changeStatus/${campaignId}/${nextStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        setModalVisible(false);
        setRefresh(true);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  return <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.checkCircle}>
          <Image style={styles.checkIcon} source={CheckIcon} />
        </View>

        <Text style={styles.title}>캠페인 상태 변경</Text>
        <View style={{ ...styles.textInput, paddingHorizontal: 2, justifyContent: 'center' }}>
          {/* TODO: 스타일 변경 */}
          <Picker
            style={{
              fontSize: 8,
            }}
            selectedValue={nextStatus}
            onValueChange={(itemValue) => setNextStatus(itemValue)}
          >
          {Object.entries(StatusNameList).map((key) => <Picker.Item
            key={key[0]}
            label={key[1]}
            value={key[0]} />)}
          </Picker>
        </View>

        <View style={styles.buttonZone}>
          <TouchableOpacity
            style={{ ...styles.modalButton, borderBottomLeftRadius: 12 }}
            onPress={onChangeStatus}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.modalButton, borderBottomRightRadius: 12 }}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    width: 300,
    height: 211,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: -0.5,
    color: '#404040',
    marginTop: 50,
  },
  subTitle: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#1f1f1f',
    marginTop: 10,

  },
  buttonZone: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 52,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: -0.4,
    color: '#ff9e3e',
  },
  checkCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -30,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff9e3e',
  },
  checkIcon: {
    width: 34,
    height: 34,
  },
  inputWrapper: {
    marginTop: 20,
  },
  label: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3b3b3b',
    marginBottom: 10,
  },
  textInput: {
    marginTop: 15,
    height: 48,
    width: 150,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    marginBottom: 10,
    color: '#000',
  },
});

export default StatusChangeModal;
