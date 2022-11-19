import { useNavigation } from '@react-navigation/native';
import { locationState } from '@src/states/user';
import React from 'react';
import {
  Image,
  Pressable, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';
import Filter from '@assets/images/filter.png';
import Search from '@assets/images/search.png';
import ArrowDown from '@assets/images/arrowDown.png';

function HomeHeader() {
  const navigation = useNavigation();
  const currentLocation = useRecoilValue(locationState);

  return <View style={styles.navContainer}>

    <Pressable onPress={() => navigation.navigate('ChangeLocation')}>
      <View style={styles.locationZone}>
        <Text style={styles.locationText}>
          {currentLocation.siGunGu ? currentLocation.siGunGu : currentLocation.siDo}
        </Text>
        <Image style={styles.icon} source={ArrowDown}/>
      </View>
    </Pressable>

    <View style={styles.navButtonZone}>
      <Pressable style={{ marginRight: 18 }} onPress={() => navigation.navigate('Search')}>
        <Image style={styles.icon} source={Search}/>
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
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontWeight: '500',
    fontSize: 25,
    color: 'black',
    marginRight: 10,
  },
  locationZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 28,
    height: 28,
  },
});
