import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Dimensions, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

import NaverMapView, { Marker } from 'react-native-nmap';
import { Coord } from '@src/@types';

import RedDot from '@assets/images/red-dot.png';
import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';

function ViewLocation({ navigation, route }) {
  const { location } = route.params;
  const [coord, setCoord] = useState<Coord | null>(null);

  useEffect(() => {
    const getCoord = async (address: string) => {
      console.log(address);
      const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${address}`;
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
        if (response.status === 200) {
          console.log(response.data.addresses);
          const { x, y } = response.data.addresses[0];
          const coordinate = {
            longitude: Number(x),
            latitude: Number(y),
          };
          setCoord(coordinate);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getCoord(location);
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 180,
        }}>
          {coord ? (
          <NaverMapView
            style={{ width: '100%', height: '100%' }}
            center={{
              zoom: 14,
              latitude: coord.latitude,
              longitude: coord.longitude,
            }}>
            <Marker
              coordinate={{
                latitude: coord.latitude,
                longitude: coord.longitude,
              }}
              width={15}
              height={15}
              anchor={{ x: 0.5, y: 0.5 }}
              caption={{ text: '수령 위치' }}
              image={RedDot}
            />
          </NaverMapView>
          ) : <Text>Loading...</Text>}
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
});

export default ViewLocation;
