import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@states/user';
import EachCampaign from '@components/Campaign/EachCampaign';

import { CampaignData } from '@src/@types';
import axios from 'axios';
import Config from 'react-native-config';
import { location } from '@src/states';

const pageSize = 10;

export function CampaignList() {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [currentLocation, setLocation] = useRecoilState(location);
  const { siDo, siGunGu } = currentLocation;

  const [campaignList, setCampaignList] = useState<CampaignData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaignData();
  }, [currentLocation]);

  const loadCampaignData = async () => {
    if (!siDo && !siGunGu) return;
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
        if (response.data.data.numberOfElements > 0) {
          const { content, totalPages } = response.data.data;
          console.log(response.data.data);
          if (currentPage === totalPages - 1) setNoMoreData(true);
          if (campaignList.length <= pageSize * currentPage) {
            setCampaignList((prev) => [...prev, ...content]);
            setCurrentPage((prev) => prev + 1);
          }
        }
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

  return <FlatList
      data={campaignList}
      keyExtractor={(item) => item.campaignId.toString()}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
    />;
}

export default CampaignList;
