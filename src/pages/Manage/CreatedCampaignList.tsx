import { userAccessToken, userState } from '@src/states';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text, View,
} from 'react-native';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';

import EachCampaign from '@components/Campaign/EachCampaign';
import { CampaignData } from '@src/@types';
import { useIsFocused } from '@react-navigation/native';

const pageSize = 20;

function CreatedCampaignList() {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const [campaignList, setCampaignList] = useState<CampaignData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
      setInitLoading(false);
    }

    return () => {
      setLoading(true);
      setCampaignList([]);
      setCurrentPage(0);
      setNoMoreData(false);
    };
  }, [isFocused]);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/campaigns?size=${pageSize}&page=${currentPage}&sort=createdDate,desc&hostId=${userInfo.userId}`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        const {
          content, first, last, number, empty,
        } = response.data.data;
        if (first) {
          setCampaignList([...content]);
        } else {
          setCampaignList((prev) => [...prev, ...content]);
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
      const url = `${Config.API_URL}/campaign/campaigns?size=${pageSize}&page=${0}&sort=createdDate,desc&hostId=${userInfo.userId}`;
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
          content, first, last,
        } = response.data.data;
        setCampaignList([...content]);
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
      loadData();
    }
  };

  const renderItem = ({ item }: { item: CampaignData }) => (
    <EachCampaign item={item} />
  );

  return <View style={styles.container}>
    {initLoading && <ActivityIndicator />}
    {!loading && !initLoading && campaignList.length === 0
      && <View style={styles.noResultMain}>
      <Text style={styles.noDataText}>아직 주최한 캠페인이 없어요</Text>
    </View>}
    {campaignList.length > 0
    && <FlatList
      data={campaignList}
      keyExtractor={(item) => `createdCampaign_${item.campaignId.toString()}`}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />}
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noResult: {
    paddingTop: 20,
    alignItems: 'center',
  },
  noResultMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default CreatedCampaignList;
