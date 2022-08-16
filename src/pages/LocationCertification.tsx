import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import NaverMapView, { Marker, Path } from 'react-native-nmap';
import { RootStackParamList } from '../@types';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationCertification'>;

function LocationCertification({ address, navigation }: Props) {
  return (
    <View>
      <View
        style={{
          width: Dimensions.get('window').width - 30,
          height: 200,
          marginTop: 10,
        }}>
        <NaverMapView
          style={{ width: '100%', height: '100%' }}
          zoomControl={false} />

          {/* // center={{
          //   zoom: 10,
          //   tilt: 50,
          //   latitude: (start.latitude + end.latitude) / 2,
          //   longitude: (start.longitude + end.longitude) / 2,
          // }}
          > */}
          {/* <Marker
            coordinate={{
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            pinColor="blue"
          />
          <Path
            coordinates={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              { latitude: end.latitude, longitude: end.longitude },
            ]}
          />
          <Marker
            coordinate={{ latitude: end.latitude, longitude: end.longitude }}
          /> */}
        {/* </NaverMapView> */}
      </View>
    </View>
  );
}

export default LocationCertification;
