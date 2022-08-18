import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, StyleSheet, Text, View,
} from 'react-native';
import NaverMapView, { Marker, Path } from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import { RootStackParamList } from '../@types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationCertification'>;

function LocationCertification({ navigation, route }: Props) {
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    // Geolocation.watchPosition
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
        distanceFilter: 100, // 일정 거리 이상 되었을때 watchPosition
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: Dimensions.get('window').width - 20,
          height: Dimensions.get('window').height - 20,
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
              image={require('../assets/images/red-dot.png')}
            />
          </NaverMapView>
          ) : (<Text>위치 정보 받아오기 실패</Text>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocationCertification;
