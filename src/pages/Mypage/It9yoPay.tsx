import { userAccessToken, userState } from '@src/states';
import axios from 'axios';
import React from 'react';
import {
  Alert,
  Dimensions, Pressable, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilState } from 'recoil';
import getUserInfo from '@utils/getUserInfo';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function It9yoPay({ navigation }) {
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const accessToken = useRecoilState(userAccessToken)[0];

  const onCheck = () => {
    Alert.alert(
      '테스트용',
      '999999원 충전',
      [
        {
          text: '네',
          onPress: onChargePoint,
        },
        {
          text: '아니요',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  const onChargePoint = async () => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/pay/charge`,
        {
          amount: 999999,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        const changedUserInfo = await getUserInfo(accessToken);
        setUserInfo(changedUserInfo);
        Alert.alert('알림', '포인트 충전이 완료되었습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (<SafeAreaView style={styles.container}>
    <View style={styles.mainContent}>

      <View style={styles.contentBlock}>
        <Text style={{ fontSize: 24, fontWeight: '500' }}>
          {`${numberWithCommas(userInfo.point)} P`}
        </Text>
      </View>

      <View style={styles.buttonZone}>
        <Pressable style={styles.button} onPress={onCheck}>
          <Text style={{
            color: 'white', fontSize: 18, marginHorizontal: 8, marginVertical: 2,
          }}>
            충전 하기
          </Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={{
            color: 'white', fontSize: 18, marginHorizontal: 8, marginVertical: 2,
          }}>
            환급 하기
          </Text>
        </Pressable>
      </View>

      <View style={styles.horizenLine} />

      <View style={styles.menuBlock}>
        <Text style={styles.menuText}>
          연결 계좌 관리
        </Text>
        <Icon name='ios-chevron-forward' size={24} color='black' />
      </View>

    </View>
  </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainContent: {
    width: Dimensions.get('screen').width - 30,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
  },
  contentBlock: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonZone: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizenLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  button: {
    maxWidth: 100,
    paddingVertical: 5,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2B950',
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  menuBlock: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '400',
  },
});
export default It9yoPay;
