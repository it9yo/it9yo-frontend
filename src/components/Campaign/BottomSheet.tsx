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
    onJoinCampaign(Number(quantity));
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

          <Text style={styles.title}>수량 입력</Text>

          {/* <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '400' }}>최대 구매 가능 수량: {campaignDetail.maxQuantityPerPerson}개</Text>
          </View> */}

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

          <View style={styles.infoBlock}>

            <View style={styles.infoTextZone}>
              <Text style={{
                fontFamily: 'SpoqaHanSansNeo',
                fontSize: 15,
                fontWeight: 'bold',
                fontStyle: 'normal',
                letterSpacing: 0,
                color: '#4f4f4f',
              }}>
                총 금액
              </Text>
              <Text style={{
                fontFamily: 'SpoqaHanSansNeo',
                fontSize: 17,
                fontWeight: 'bold',
                fontStyle: 'normal',
                letterSpacing: 0,
                color: '#121212',
              }}>
                {numberWithCommas(amount)} 원
              </Text>
            </View>

          </View>

          <TouchableOpacity
            style={canGoNext ? styles.button : { ...styles.button, backgroundColor: '#e0e0e0' }}
            disabled={!canGoNext}
            onPress={onCheckJoin}
          >
            <Text style={styles.buttonText}>참가하기</Text>
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
    height: 48,
    borderRadius: 4,
    backgroundColor: '#ff9e3e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
  },
  quantityInput: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#282828',
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 24,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 22,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.2,
    color: '#121212',
  },
  infoBlock: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#eeeeee',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 35,
  },
  infoTextZone: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  horizonLine: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 15,
  },
});

export default BottomSheet;
