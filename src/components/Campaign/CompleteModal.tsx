import React from 'react';
import {
  Image,
  Modal, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

import CheckIcon from '@assets/images/check.png';

function CompleteModal({ modalVisible, setModalVisible }) {
  return <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.checkCircle}>
          <Image style={styles.checkIcon} source={CheckIcon} />
        </View>

        <Text style={styles.title}>참여 완료</Text>
        <Text style={styles.subTitle}>공동구매 참여가 완료되었습니다</Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>

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
  modalButton: {
    width: '100%',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
});

export default CompleteModal;
