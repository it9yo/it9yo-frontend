import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Alert,
  Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';
import axios, { AxiosResponse } from 'axios';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { SignUpParamList } from '@src/@types';
import { signupState, userState } from '@src/states';

import RedDot from '@assets/images/red-dot.png';

type Props = NativeStackScreenProps<SignUpParamList, 'LocationCertification'>;

function LocationCertification({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);
  const setUserInfo = useSetRecoilState(userState);

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

      const sido = response.data.results[0].region.area1.name;
      const sidoAlias = response.data.results[0].region.area1.alias;
      const sigungu = response.data.results[0].region.area2.name;

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
        // console.log(response.data.data);
        // const { data } = response.data;
        // setUserInfo({ ...data });
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
          height: Dimensions.get('window').height - 100,
        }}>
          {myPosition ? (
          <NaverMapView
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            center={{
              zoom: 13,
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
              subCaption={{ text: '현 위치' }}
              image={RedDot}
            />
          </NaverMapView>
          ) : <Text>Loading...</Text>}
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
});

export default LocationCertification;
