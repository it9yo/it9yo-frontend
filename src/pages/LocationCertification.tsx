import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import NaverMapView, { Marker, Path } from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import { useRecoilState } from 'recoil';
import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';
import { RootStackParamList } from '../@types';
import { signupState } from '../recoil';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationCertification'>;

function LocationCertification({ navigation }: Props) {
  const [signupInfo, setSignupInfo] = useRecoilState(signupState);

  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    console.log('signupInfo', signupInfo);
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
    console.log(Config.NAVER_MAP_CLIENT_ID);
    console.log(Config.NAVER_MAP_CLIENT_SECRET);
    console.log(myPosition);
    const getAddressByLocation = async (lat: number, lng: number) => {
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
      const result = {
        sido: response.data.results[0].region.area1.name,
        sidoAlias: response.data.results[0].region.area1.alias,
        sigungu: response.data.results[0].region.area2.name,
      };
      return result;
    };

    if (myPosition) {
      getAddressByLocation(myPosition.latitude, myPosition.longitude);
    }
  }, [myPosition]);

  const canGoNext = true;

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
              latitude: myPosition?.latitude,
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
              image={require('../assets/images/red-dot.png')}
            />
          </NaverMapView>
          ) : <Text>Loading...</Text>}
      </View>

      <View style={styles.buttonZone}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => navigation.pop()}>
          <Text style={styles.buttonText}>나중에 하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            canGoNext
              ? StyleSheet.compose(styles.button, styles.buttonActive)
              : styles.button
          }
          disabled={!canGoNext}>
          <Text style={styles.buttonText}>회원 가입 완료</Text>
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

export default LocationCertification;
