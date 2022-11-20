import React, { useEffect, useState } from 'react';

import {
  Alert,
  Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
import axios, { AxiosResponse } from 'axios';

import { useRecoilState } from 'recoil';

import { userAccessToken, userState } from '@states/user';
import { Coord } from '@src/@types';

import ChatBubble from '@assets/images/chatBubble.png';

function LocCert({ navigation, route }) {
  const { currentLocation } = route.params;
  const accessToken = useRecoilState(userAccessToken)[0];
  const [userInfo, setUserInfo] = useRecoilState(userState);

  const [myPosition, setMyPosition] = useState<Coord | null>(null);

  const [locationAuth, setLocationAuth] = useState(false);

  const [doro, setDoro] = useState('');

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

        const { region } = response.data.results[0];
        const sido = region.area1.name;
        const sidoAlias = region.area1.alias;
        const sigungu = region.area2.name;
        const eupMyeonDong = region.area3.name;
        setDoro(`${sido} ${sigungu} ${eupMyeonDong}`);

        if ((currentLocation.siDo === sido || currentLocation.siDo === sidoAlias)
          && currentLocation.siGunGu === sigungu) {
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

  const onLocationCert = async () => {
    try {
      const siDo = currentLocation.sido;
      const siGunGu = currentLocation.sigungu;

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
        Alert.alert('알림', '지역 인증이 완료되었습니다.');
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
          height: Dimensions.get('window').height - 140,
        }}>
        {myPosition && (
          <NaverMapView
            style={{ width: '100%', height: '100%' }}
            center={{ ...myPosition, zoom: 13 }}>
            <Marker
              coordinate={myPosition}
              width={300}
              height={80}>
              <View style={{
                flex: 1, alignItems: 'center',
              }}>
                <View>
                  <Image
                    source={ChatBubble}
                    style={{ width: 165, height: 55 }}/>
                  <Text style={styles.bubbleText}>{doro}</Text>
                </View>
                <View style={styles.behindEllipse}>
                  <View style={styles.frontEllipse} />
                </View>
              </View>
            </Marker>
          </NaverMapView>
        )}
      </View>

      <TouchableOpacity
        style={
          locationAuth
            ? StyleSheet.compose(styles.button, styles.buttonActive)
            : styles.button}
        disabled={!locationAuth}
        onPress={onLocationCert}>
        <Text style={styles.buttonText}>지역 인증 완료</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ababab',
  },
  buttonActive: {
    backgroundColor: '#ff9e3e',
  },
  buttonText: {
    width: 180,
    height: 20,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  behindEllipse: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontEllipse: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    zIndex: 1,
  },
  bubbleText: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    top: 12,
    alignSelf: 'center',
    color: '#000000',
  },
});

export default LocCert;
