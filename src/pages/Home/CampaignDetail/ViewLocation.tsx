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

import UserIcon from '@assets/images/user.png';
import GPSIcon from '@assets/images/gps.png';
import { CampaignData } from '../../../@types/index.d';

function ViewLocation({ navigation, route }) {
  const { campaignDetail }:{ campaignDetail: CampaignData } = route.params;
  const {
    title, hostNickName, itemImageURLs, siDo, siGunGu, doro, detailAddress,
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

    getCoord(doro);
  }, [doro]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 70,
        }}>
        {coord && (
          <NaverMapView
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
            center={{
              zoom: 13,
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
              image={RedDot}
            />
          </NaverMapView>
        )}
      </View>

      <View style={styles.bottomNav}>
        <Image style={styles.campaignThumbnail}
          source={{ uri: itemImageURLs[0] }}
        />

        <View style={{ flex: 1 }}>
          {/* 제목 */}
          <Text style={styles.campaignTitleText}>{title}</Text>
          {/* 호스트 정보 */}
          <View style={styles.infoZone}>
            <Image style={styles.icon} source={UserIcon} />
            <Text style={styles.infoText}>{hostNickName}</Text>
          </View>
          {/* 주소 */}
          <View style={styles.infoZone}>
            <Image style={styles.icon} source={GPSIcon} />
            <Text style={styles.infoText}>{doro}</Text>
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
    bottom: 30,
    flexDirection: 'row',
    width: 320,
    height: 144,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    // elevation: 5,
    alignItems: 'center',
    paddingLeft: 20,
  },
  campaignThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  campaignTitleText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 10,

  },
  infoZone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 14,
    height: 14,
    opacity: 0.7,
  },
  infoText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#828282',
    marginLeft: 5,
  },
});

export default ViewLocation;
