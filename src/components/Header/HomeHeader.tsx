import { useNavigation } from '@react-navigation/native';
import { locationState } from '@src/states/user';
import React from 'react';
import {
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';

function HomeHeader() {
  const navigation = useNavigation();
  const currentLocation = useRecoilValue(locationState);

  return <View style={styles.navContainer}>

    <Pressable onPress={() => navigation.navigate('ChangeLocation')}>
    <View style={styles.locationZone}>
      <Text style={styles.locationText}>
        {currentLocation.siGunGu ? currentLocation.siGunGu : currentLocation.siDo}
      </Text>
      <Icon style={{ paddingLeft: 2 }} name="chevron-down" size={24} color="#000" />
    </View>
    </Pressable>

    <View style={styles.navButtonZone}>
    <Pressable>
      <Icon name="filter" size={28} color="#000" />
    </Pressable>
    <Pressable style={{ marginLeft: 5 }} onPress={() => navigation.navigate('Search')}>
      <Icon name="search" size={24} color="#000" />
    </Pressable>
    </View>

 </View>;
}

export default HomeHeader;

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderBottom: 1,
    borderBottomColor: 'black',
    height: 56,
  },
  navButtonZone: {
    position: 'absolute',
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontWeight: '500',
    fontSize: 25,
    color: 'black',
  },
  locationZone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
