import React from 'react';

import CampaignList from '@pages/Home/CampaignList';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeHeader from '@src/components/Header/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { location } from '@src/states';
import { useRecoilState } from 'recoil';

function Home() {
  const navigation = useNavigation();
  const [currentLocation, setLocation] = useRecoilState(location);

  return <SafeAreaView style={styles.container}>
    <HomeHeader />

    <CampaignList />

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('CreateCampaign')}
      style={styles.floatingButtonStyle}>
      <Icon name='add-circle' size={60}/>
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
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    right: 30,
    bottom: 40,
  },
});
