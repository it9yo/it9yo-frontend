import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { CampaignData } from '@src/@types';
import Icon from 'react-native-vector-icons/Ionicons';
import { userState } from '@states/user';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const BottomSheet = (props) => {
  const { modalVisible, setModalVisible, onJoinCampaign } = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const { campaignDetail } : { campaignDetail: CampaignData } = props;
  const userInfo = useRecoilState(userState)[0];
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState(campaignDetail.itemPrice);

  const canGoNext = userInfo.point >= amount;

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderMove: (event, gestureState) => {
      panY.setValue(gestureState.dy);
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dy > 0 && gestureState.vy > 1.5) {
        closeModal();
      } else {
        resetBottomSheet.start();
      }
    },
  })).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }
  }, [props.modalVisible]);

  useEffect(() => {
    console.log(campaignDetail);
    setAmount(campaignDetail.itemPrice);
  }, []);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };

  const onChangeQuantity = (value: string) => {
    const parsedQty = Number(value);
    const maxQty = campaignDetail.maxQuantityPerPerson;
    const price = campaignDetail.itemPrice;
    if (Number.isNaN(parsedQty)) {
      setQuantity('1');
      setAmount(price);
    } else if (parsedQty > maxQty) {
      setQuantity(String(maxQty));
      setAmount(maxQty * price);
    } else {
      setQuantity(String(parsedQty));
      setAmount(parsedQty * price);
    }
  };

  const onCheckJoin = () => {
    Alert.alert(
      '알림',
      `정말 ${amount} 원을 사용하여 캠페인에 참가하시겠습니까?`,
      [
        {
          text: '네',
          onPress: () => onJoinCampaign(Number(quantity)),
        },
        {
          text: '아니요',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background}/>
        </TouchableWithoutFeedback>
        <Animated.View
          style={{ ...styles.bottomSheetContainer, transform: [{ translateY }] }}
          {...panResponders.panHandlers}
        >
          <Icon name="chevron-down" size={24} color="#000" />

          <View style={{
            width: '100%', alignItems: 'flex-start', marginTop: 15, marginBottom: 8,
          }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>수량을 선택하세요</Text>
          </View>

          <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '400' }}>최대 구매 가능 수량: {campaignDetail.maxQuantityPerPerson}개</Text>
          </View>

          <View style={styles.outerBorder}>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={onChangeQuantity}
              placeholder="수량을 입력하세요"
              placeholderTextColor="#666"
              clearButtonMode="while-editing"
              blurOnSubmit={false}
              keyboardType="numeric"
            />
          </View>

          <View style={{
            flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15,
          }}>
            <Text style={{ fontSize: 24, fontWeight: '400' }}>결제포인트: </Text>
            <Text style={{ fontSize: 24, fontWeight: '400' }}>{numberWithCommas(amount)} 원</Text>
          </View>

          <View style={{
            width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
          }}>
            <Text style={{ fontSize: 20, fontWeight: '400' }}>포인트 잔액: {numberWithCommas(userInfo.point)} 원</Text>
            <TouchableOpacity style={{ ...styles.button, width: 100, height: 35 }} >
              <Text style={styles.buttonText}>충전하기</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={canGoNext ? styles.button : { ...styles.button, backgroundColor: 'gray' }}
            disabled={!canGoNext}
            onPress={onCheckJoin}
          >
            <Text style={styles.buttonText}>결제하기</Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: 400,
    // justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    width: '100%',
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
  quantityInput: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    fontSize: 18,
  },
  outerBorder: {
    width: '100%',
    borderWidth: 4,
    borderColor: '#ADB5BD',
    marginBottom: 20,
  },
});

export default BottomSheet;
