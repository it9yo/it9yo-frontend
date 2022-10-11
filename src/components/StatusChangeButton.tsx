import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import StatusNameList from '@constants/statusname';
import { Picker } from '@react-native-picker/picker';

function StatusChangeButton({ status, onChangeStatus }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nextStatus, setNextStatus] = useState<string[]>([]);

  useEffect(() => {
    switch (status) {
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
  }, [status]);

  const handleStatusChange = async (newStatus: string) => {
    Alert.alert( // 말그대로 Alert를 띄운다
      '알림',
      `정말 ${StatusNameList[status]}에서 ${StatusNameList[newStatus]}(으)로 바꾸시겠습니까?`,
      [ // 버튼 배열
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
    <Text style={{ fontSize: 18, marginRight: 10 }}>{StatusNameList[status]}</Text>
    <TouchableOpacity style={styles.button}>
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
  //
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
