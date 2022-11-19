import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text, View,
} from 'react-native';

import { useRecoilState, useRecoilValue } from 'recoil';
import { locationState, userAccessToken } from '@states/user';
import EachCampaign from '@components/Campaign/EachCampaign';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { useIsFocused } from '@react-navigation/native';

const pageSize = 20;

export function CampaignList({ title }:{ title?: string }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const currentLocation = useRecoilValue(locationState);
  const { siDo, siGunGu } = currentLocation;
  const isFocused = useIsFocused();

  const [campaignList, setCampaignList] = useState<CampaignData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      loadCampaignData();
      setInitLoading(false);
    }
    return () => {
      setCampaignList([]);
      setCurrentPage(0);
      setNoMoreData(false);
    };
  }, [currentLocation, isFocused, title]);

  const loadCampaignData = async () => {
    if (!siDo && !siGunGu) return;
    if (noMoreData) return;
    try {
      setLoading(true);
      const url = title
        ? `${Config.API_URL}/campaign/campaigns?siDo=${siDo}&siGunGu=${siGunGu}&size=${pageSize}&page=${currentPage}&campaignStatus=RECRUITING&sort=createdDate&direction=ASC&title=${title}`
        : `${Config.API_URL}/campaign/campaigns?siDo=${siDo}&siGunGu=${siGunGu}&size=${pageSize}&page=${currentPage}&campaignStatus=RECRUITING&sort=createdDate&direction=ASC`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('currentLocation', currentLocation, 'response', response.data.data);
      if (response.status === 200) {
        const {
          content, first, last, number,
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
    if (!siDo && !siGunGu) return;
    try {
      setRefreshing(true);
      const url = title
        ? `${Config.API_URL}/campaign/campaigns?siDo=${siDo}&siGunGu=${siGunGu}&size=${pageSize}&page=${0}&campaignStatus=RECRUITING&sort=createdDate&direction=ASC&title=${title}`
        : `${Config.API_URL}/campaign/campaigns?siDo=${siDo}&siGunGu=${siGunGu}&size=${pageSize}&page=${0}&campaignStatus=RECRUITING&sort=createdDate&direction=ASC`;

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
      loadCampaignData();
    }
  };

  const renderItem = ({ item }: { item: CampaignData }) => (
    <EachCampaign item={item}/>
  );

  return <View style={styles.container}>
    {initLoading && <ActivityIndicator />}
    {title && !initLoading && campaignList.length === 0
      && <View style={styles.noResult}>
        <Text>검색 결과가 없습니다.</Text>
      </View>}
    <FlatList
      data={campaignList}
      keyExtractor={(item) => `campaign_${item.campaignId.toString()}`}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  </View>;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
  noResult: {
    alignItems: 'center',
    padding: 20,
  },
});

export default CampaignList;
