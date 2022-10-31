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
        if (first) {
          setCampaignList([...content]);
        } else if (!empty) {
          setCampaignList((prev) => [...prev, ...content]);
        }
        setCurrentPage(number + 1);
        if (last) setNoMoreData(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
    /> : <Text>no data</Text>}
  </View>;
}

export default CampaignList;
