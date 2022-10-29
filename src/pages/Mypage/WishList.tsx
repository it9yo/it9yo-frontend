import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  FlatList, Image, Pressable, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@states/user';
import EachCampaign from '@components/EachCampaign';

import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Config from 'react-native-config';
import { useIsFocused } from '@react-navigation/native';

const pageSize = 20;

interface WishListData {
  id : number;
  userId : number;
  campaignId : number;
}

export function WishList({ navigation }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [wishList, setWishList] = useState<WishListData[]>([]); // TODO

  const [currentPage, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    console.log('wishlist start');
    loadWishList(0, pageSize);

    return setWishList([]);
  }, [isFocused]);

  // if (!campaignList.length || campaignList.length >= page * pageSize) {

  const loadWishList = async (page: number, size: number) => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/findAll?size=${size}&page=${page}&sort=createdDate&direction=DESC&title=&siDo=${currentLocation.siDo}&siGunGu=${currentLocation.siGunGu}`;
      console.log(`url: ${url}`);
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data.data.content);
      if (response.status === 200 && response.data.data.numberOfElements > 0) {
        const { content } = response.data.data;
        content.map((item: WishListData) => setWishList((prev) => [...prev, item]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const onEndReached = () => {
  //   if (!loading) {
  //     loadCampaignData();
  //   }
  // };

  const renderItem = ({ item }: { item: WishListData }) => (
    <EachCampaign item={item}/>
  );

  return <SafeAreaView style={styles.container}>
    <View style={styles.navContainer}>
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
    </View>

    <FlatList
      data={wishList}
      keyExtractor={(item) => item.campaignId.toString()}
      renderItem={renderItem}
      // onEndReached={onEndReached}
      // onEndReachedThreshold={0.6}
      // ListFooterComponent={loading && <ActivityIndicator />}
    />

    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('CreateCampaign')}
      style={styles.floatingButtonStyle}>
      <Icon name='add-circle' size={60}/>
    </TouchableOpacity>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  navContainer: {
    // zIndex: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
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

  floatingButtonStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    right: 30,
    bottom: 80,
  },
});

export default WishList;
