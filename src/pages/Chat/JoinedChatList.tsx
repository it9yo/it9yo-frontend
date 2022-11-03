import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { ChatRoomData } from '@src/@types';
import EachChat from '@src/components/EachChat';

const pageSize = 10;

function JoinedChatList({ navigation }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [chatList, setChatList] = useState<ChatRoomData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    loadData();
  }, [isFocused]);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/chat/joining?size=${pageSize}&page=${currentPage}&sort=createdDate&direction=DESC`;
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
          if (chatList.length <= pageSize * currentPage) {
            setChatList((prev) => [...prev, ...content]);
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
      loadData();
    }
  };

  const renderItem = ({ item }: { item: ChatRoomData }) => (
    <EachChat item={item}/>
  );

  return <FlatList
      data={chatList}
      keyExtractor={(item) => item.campaignId.toString()}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
    />;
}

const styles = StyleSheet.create({
  container: {
    marginTop: StyleSheet.hairlineWidth,
    height: '100%',
  },
});

export default JoinedChatList;
