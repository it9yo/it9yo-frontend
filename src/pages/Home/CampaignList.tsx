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
      setLoading(true);
      setCurrentPage(0);
      setNoMoreData(false);
      setCampaignList([]);
    };
  }, [currentLocation, isFocused, title]);

  const loadCampaignData = async () => {
    if (!siDo && !siGunGu) return;
    if (noMoreData) return;
    try {
      setLoading(true);
      let url = `${Config.API_URL}/campaign/campaigns?siDo=${siDo}&siGunGu=${siGunGu}&size=${pageSize}&page=${currentPage}&campaignStatus=RECRUITING&sort=createdDate,desc`;
      if (title) {
        url += `&title=${title}`;
      }
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
      let url = `${Config.API_URL}/campaign/campaigns?siDo=${siDo}&siGunGu=${siGunGu}&size=${pageSize}&page=${0}&campaignStatus=RECRUITING&sort=createdDate,desc`;
      if (title) {
        url += `&title=${title}`;
      }

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

  const onRefresh = async () => {
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
        <Text>검색 결과가 없습니다</Text>
      </View>}
    {!title && !loading && !initLoading && campaignList.length === 0
      && <View style={styles.noResultMain}>
      <Text style={styles.noDataText}>아직 이 지역에 등록된 캠페인이 없어요</Text>
    </View>}
    {campaignList.length > 0 && <FlatList
      data={campaignList}
      keyExtractor={(item) => `campaign_${item.campaignId.toString()}`}
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

export default CampaignList;
