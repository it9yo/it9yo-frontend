import React, { useEffect, useState } from 'react';
import {
  FlatList, SafeAreaView, StyleSheet, Text, View, ActivityIndicator,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@states/user';

import axios from 'axios';
import Config from 'react-native-config';
import EachCampaign from '@components/Campaign/EachCampaign';
import { useIsFocused } from '@react-navigation/native';
import { CampaignData } from '../../@types/index.d';

const pageSize = 20;

export function WishList() {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [wishList, setWishList] = useState<CampaignData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('im focuesd');
      loadWishList();
    }

    return () => {
      setLoading(true);
      setWishList([]);
      setCurrentPage(0);
      setNoMoreData(false);
    };
  }, [isFocused]);

  const loadWishList = async () => {
    if (noMoreData) return;
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/wish/wishes?size=${pageSize}&page=${currentPage}&sort=createdDate&direction=DESC`;

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data.data);
        const {
          content, first, last, number, empty,
        } = response.data.data;
        if (empty) return;
        if (first) {
          setWishList([...content]);
        } else {
          setWishList((prev) => [...prev, ...content]);
        }
        setCurrentPage(number + 1);
        if (last) {
          setNoMoreData(true);
        } else {
          setNoMoreData(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRefreshData = async () => {
    try {
      setRefreshing(true);
      const url = `${Config.API_URL}/campaign/wish/wishes?size=${pageSize}&page=${0}&sort=createdDate&direction=DESC`;

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        console.log(response.data.data);
        const { content, first, last } = response.data.data;
        setWishList([...content]);
        if (first) {
          setCurrentPage(1);
        }
        if (last) {
          setNoMoreData(true);
        } else {
          setNoMoreData(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (!refreshing) {
      getRefreshData();
    }
  };

  const onEndReached = () => {
    if (!noMoreData || !loading) {
      loadWishList();
    }
  };

  const renderItem = ({ item }: { item: CampaignData }) => (
    <EachCampaign item={item}/>
  );

  return <SafeAreaView style={styles.container}>
    {wishList.length === 0 && !loading && <View style={styles.noDataZone}>
    <Text style={styles.noDataText}>찜한 공동구매가 없어요</Text>
    </View>}
    {wishList.length > 0 && <FlatList
      data={wishList}
      keyExtractor={(item) => `wishList_${item.campaignId.toString()}`}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  noDataZone: {
    paddingTop: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontFamily: 'NotoSansKR',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#000000',
    opacity: 0.3,
    marginBottom: 10,
  },
});

export default WishList;
