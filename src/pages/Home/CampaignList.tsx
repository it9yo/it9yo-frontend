import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Text, View,
} from 'react-native';

import { useRecoilState, useRecoilValue } from 'recoil';
import { locationState, userAccessToken } from '@states/user';
import EachCampaign from '@components/Campaign/EachCampaign';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';

const pageSize = 20;

export function CampaignList() {
  const accessToken = useRecoilState(userAccessToken)[0];
  const currentLocation = useRecoilValue(locationState);
  const { siDo, siGunGu } = currentLocation;

  const [campaignList, setCampaignList] = useState<CampaignData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    loadCampaignData();
    return () => {
      setCampaignList([]);
      setCurrentPage(0);
      setNoMoreData(false);
    };
  }, [currentLocation]);

  const loadCampaignData = async () => {
    if (!siDo && !siGunGu) return;
    if (noMoreData) return;
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/campaigns?size=${pageSize}&page=${currentPage}&sort=createdDate&direction=DESC&campaignStatus=RECRUITING&siDo=${siDo}&siGunGu=${siGunGu}`;

      console.log(`url: ${url}`);
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
      const url = `${Config.API_URL}/campaign/campaigns?size=${pageSize}&page=${0}&sort=createdDate&direction=DESC&campaignStatus=RECRUITING&siDo=${siDo}&siGunGu=${siGunGu}`;

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

  return <View>
    {campaignList.length > 0 ? <FlatList
      data={campaignList}
      keyExtractor={(item) => item.campaignId.toString()}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      onRefresh={onRefresh}
      refreshing={refreshing}
    /> : <Text>no data</Text>}
  </View>;
}

export default CampaignList;
