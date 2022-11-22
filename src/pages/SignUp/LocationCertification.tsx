import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Alert,
  Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
import axios, { AxiosResponse } from 'axios';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { SignUpParamList } from '@src/@types';
import { signupState, userState } from '@src/states';

import ChatBubble from '@assets/images/chatBubble.png';

type Props = NativeStackScreenProps<SignUpParamList, 'LocationCertification'>;

function LocationCertification({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);
  const setUserInfo = useSetRecoilState(userState);

  const [doro, setDoro] = useState('');

  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
    const isLocationOk = async (lat: number, lng: number) => {
      const url = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&orders=addr&output=json`;
      const response: AxiosResponse<any, any> = await axios.get(
        url,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': Config.NAVER_MAP_CLIENT_ID,
            'X-NCP-APIGW-API-KEY': Config.NAVER_MAP_CLIENT_SECRET,
          },
        },
      );
      console.log(response.data.results[0]);
      const { region } = response.data.results[0];
      const sido = region.area1.name;
      const sidoAlias = region.area1.alias;
      const sigungu = region.area2.name;
      const eupMyeonDong = region.area3.name;
      setDoro(`${sido} ${sigungu} ${eupMyeonDong}`);

      if ((signupInfo.siDo === sido || signupInfo.siDo === sidoAlias)
        && signupInfo.siGunGu === sigungu) {
        setLocationAuth(true);
        Alert.alert('알림', '지역 인증이 완료되었습니다.');
      } else {
        Alert.alert('알림', '지역이 일치하지 않습니다.');
      }
    };

    if (myPosition) {
      isLocationOk(myPosition.latitude, myPosition.longitude);
    }
  }, [myPosition]);

  const onSignup = async () => {
    try {
      setSignupInfo({
        ...signupInfo,
        locationAuth,
      });
      console.log('signupInfo', signupInfo);
      const response = await axios.post(
        `${Config.API_URL}/auth/signUp`,
        {
          ...signupInfo,
        },
      );

      if (response.status === 200) {
        navigation.push('SignupComplete');
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
            center={{ ...myPosition, zoom: 15 }}>
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
        style={StyleSheet.compose(styles.button, styles.buttonActive)}
        onPress={onSignup}
        >
        <Text style={styles.buttonText}>다음</Text>
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

export default LocationCertification;
