import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Dimensions, Text, StyleSheet, Image,
} from 'react-native';

import NaverMapView, { Marker } from 'react-native-nmap';
import { Coord } from '@src/@types';

import RedDot from '@assets/images/red-dot.png';
import axios, { AxiosResponse } from 'axios';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/Ionicons';
import { CampaignData } from '../../../@types/index.d';

function ViewLocation({ navigation, route }) {
  const { campaignDetail }:{ campaignDetail: CampaignData } = route.params;
  const {
    title, hostNickName, itemImageURLs, detailAddress,
  } = campaignDetail;
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

    getCoord(detailAddress);
  }, [detailAddress]);

  return (
    <SafeAreaView style={styles.container}>
      {coord ? (
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 230,
          }}>
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
        </View>
      ) : <Text>Loading...</Text>}
      <View style={styles.bottomNav}>
        <View style={styles.itemImageZone}>
          <Image style={styles.imageThumbnail}
            source={{ uri: itemImageURLs[0] }}
          />
        </View>
        <View style={styles.detailInfoZone}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>{title}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="person-outline" size={18} color="#000" />
            <Text style={{
              fontWeight: '600', fontSize: 15, color: 'orange', marginLeft: 2,
            }}>
              {hostNickName}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="location-outline" size={18} color="#000" />
            <Text style={{
              fontWeight: '600', fontSize: 15, color: 'black', marginLeft: 2,
            }}>
              {detailAddress}
            </Text>
          </View>

        </View>
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
  bottomNav: {
    position: 'absolute',
    width: '100%',
    height: 150,
    flexDirection: 'row',
    backgroundColor: 'white',
    bottom: 0,
  },
  itemImageZone: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingBottom: 20,
  },
  detailInfoZone: {
    flex: 2,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingBottom: 20,
  },
  imageThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 80 / 2,
    marginRight: 10,
  },
});

export default ViewLocation;
