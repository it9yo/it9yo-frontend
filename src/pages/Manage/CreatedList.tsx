import { userAccessToken } from '@src/states';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';

import EachCampaign from '@components/EachCampaign';
import { CampaignData } from '@src/@types';

const pageSize = 20;

function CreatedList() {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [campaignList, setCampaignList] = useState<CampaignData[] | null>(null); // TODO

  useEffect(() => {
    console.log('CampaignList start');
    loadData();
  }, []);

  const loadData = async () => {
    if (!campaignList || campaignList.length >= page * pageSize) {
      try {
        setLoading(true);
        const url = `${Config.API_URL}/campaign/createByMe?status=RECRUITING&size=2&page=0&sort=createdDate&direction=DESC`;
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
          // setPage((prev) => prev + 1);
          // setCampaignList();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onEndReached = () => {
    if (!loading) {
      loadData();
    }
  };

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
