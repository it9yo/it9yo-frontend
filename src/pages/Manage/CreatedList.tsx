import { userAccessToken } from '@src/states';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';

import EachCampaign from '@components/EachCampaign';
import { CampaignData } from '@src/@types';
import { useIsFocused } from '@react-navigation/native';

const pageSize = 20;

function CreatedList() {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [campaignList, setCampaignList] = useState<CampaignData[]>([]); // TODO

  const [currentPage, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    loadData(0, pageSize);

    return setCampaignList([]);
  }, [isFocused]);

  const loadData = async (page: number, size: number) => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/createByMe?status=RECRUITING&size=${size}&page=${page}&sort=createdDate&direction=DESC`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response);
      console.log(response.data.data);
      if (response.status === 200 && response.data.data.numberOfElements > 0) {
        const { content } = response.data.data;
        content.map((item: CampaignData) => setCampaignList((prev) => [...prev, item]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const onEndReached = () => {
  //   if (!loading) {
  //     loadData();
  //   }
  // };

  const renderItem = ({ item }: { item: CampaignData }) => (
    <EachCampaign item={item}/>
  );

  return <View style={{ flex: 1 }}>
    <FlatList
      data={campaignList}
      keyExtractor={(item) => item.campaignId.toString()}
      renderItem={renderItem}
      // onEndReached={onEndReached}
      // onEndReachedThreshold={0.6}
      // ListFooterComponent={loading && <ActivityIndicator />}
    />
  </View>;
}

export default CreatedList;
