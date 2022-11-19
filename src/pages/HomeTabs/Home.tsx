import React, { useEffect } from 'react';

import CampaignList from '@pages/Home/CampaignList';
import {
  Image, SafeAreaView, StyleSheet, TouchableOpacity,
} from 'react-native';
import HomeHeader from '@src/components/Header/HomeHeader';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import Plus from '@assets/images/plus.png';

function Home() {
  const navigation = useNavigation();

  return <SafeAreaView style={styles.container}>
    <HomeHeader />

    <CampaignList />

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('CreateCampaign')}
      style={styles.floatingButtonStyle}>
      <Image style={{ width: 24, height: 24 }} source={Plus} />
    </TouchableOpacity>
  </SafeAreaView>;
}

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  floatingButtonStyle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff9e3e',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 8,
    right: 22,
    bottom: 22,
  },
});
