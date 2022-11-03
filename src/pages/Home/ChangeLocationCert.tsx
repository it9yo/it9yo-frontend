import React, { useEffect, useState } from 'react';

import {
  Alert,
  Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
import axios, { AxiosResponse } from 'axios';

import { useRecoilState } from 'recoil';

import RedDot from '@assets/images/red-dot.png';
import { userAccessToken, userState } from '@states/user';
import { Coord } from '@src/@types';

function ChangeLocationCert({ navigation, route }) {
  const changedLocation = route.params;
  const accessToken = useRecoilState(userAccessToken)[0];
  const [userInfo, setUserInfo] = useRecoilState(userState);

  const [myPosition, setMyPosition] = useState<Coord | null>(null);

  const [locationAuth, setLocationAuth] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (info) => {
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    );
  }, []);

  useEffect(() => {
    const isLocationOk = async (position: Coord) => {
      const { latitude, longitude } = position;
      const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${longitude},${latitude}&orders=addr&output=json`;
      try {
        const response: AxiosResponse<any, any> = await axios.get(
          url,
          {
            headers: {
              'X-NCP-APIGW-API-KEY-ID': Config.NAVER_MAP_CLIENT_ID,
              'X-NCP-APIGW-API-KEY': Config.NAVER_MAP_CLIENT_SECRET,
            },
          },
        );

        console.log(response);

        const sido = response.data.results[0].region.area1.name;
        const sidoAlias = response.data.results[0].region.area1.alias;
        const sigungu = response.data.results[0].region.area2.name;

        if ((changedLocation.sido === sido || changedLocation.sido === sidoAlias)
          && changedLocation.sigungu === sigungu) {
          setLocationAuth(true);
          Alert.alert('알림', '지역 인증이 완료되었습니다.');
        } else {
          Alert.alert('알림', '지역이 일치하지 않습니다.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (myPosition) {
      isLocationOk(myPosition);
    }
  }, [myPosition]);

  const onChangeLocation = async () => {
    try {
      const siDo = changedLocation.sido;
      const siGunGu = changedLocation.sigungu;

      const response = await axios.patch(
        `${Config.API_URL}/user/edit/address`,
        {
          siDo,
          siGunGu,
          locationAuth,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        setUserInfo({
          ...userInfo,
          siDo,
          siGunGu,
          locationAuth,
        });
        // TODO
        Alert.alert('알림', '지역 변경이 완료되었습니다.');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 180,
        }}>
          {myPosition ? (
          <NaverMapView
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            center={{
              zoom: 10,
              latitude: myPosition.latitude,
              longitude: myPosition.longitude,
            }}>
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              width={15}
              height={15}
              anchor={{ x: 0.5, y: 0.5 }}
              caption={{ text: '현 위치' }}
              image={RedDot}
            />
          </NaverMapView>
          ) : <Text>Loading...</Text>}
      </View>

      <View style={styles.buttonZone}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => navigation.pop()}>
          <Text style={styles.buttonText}>이전으로</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={onChangeLocation}
        >
          <Text style={styles.buttonText}>지역 변경 하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  buttonZone: {
    position: 'absolute',
    width: '90%',
    bottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  button: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChangeLocationCert;
