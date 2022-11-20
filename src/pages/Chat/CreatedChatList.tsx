/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { chatRefresh, userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { CampaignData, ChatListData } from '@src/@types';
import EachChat from '@src/components/EachChat';
import AsyncStorage from '@react-native-community/async-storage';

const pageSize = 50;

function CreatedChatList({ navigation }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const [refresh, setRefresh] = useRecoilState(chatRefresh);
  const [chatList, setChatList] = useState<CampaignData[]>([]);
  const [sortedChatList, setSortedChatList] = useState<ChatListData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused || refresh) {
      loadData();
    }
  }, [isFocused, refresh]);

  useEffect(() => {
    if (chatList && (isFocused || refresh)) {
      getLastMessages();
      setInitLoading(false);
      setRefresh(false);
    }
  }, [chatList, isFocused, refresh]);

  const loadData = async () => {
    if (noMoreData || loading) return;
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/campaigns?&size=${pageSize}&page=${currentPage}&hostId=${userInfo.userId}`;
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
          content, first, last, number,
        } = response.data.data;
        console.log('content', content);
        if (first) {
          setChatList([...content]);
        } else {
          setChatList((prev) => [...prev, ...content]);
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

  async function getLastMessages() {
    if (chatList.length === 0) return;
    console.log(chatList);
    const chatListDict = {};
    const chatKeys = chatList.map((chat) => {
      chatListDict[chat.campaignId] = chat;
      return `lastChat_${chat.campaignId}`;
    });
    const datas: [key: string, value: string][] = await AsyncStorage.multiGet(chatKeys);

    const sortedDatas = datas.sort((a, b) => {
      const [a_key, a_value] = a;
      const [b_key, b_value] = b;
      if (a_value && b_value) return JSON.parse(b_value).sentTime - JSON.parse(a_value).sentTime;
      if (a_value) return -1;
      if (b_value) return 1;
      return 0;
    });
    const sortedList = sortedDatas.map((data) => {
      const [key, value] = data;

      const campaignId = Number(key.split('_')[1]);
      return {
        ...chatListDict[campaignId],
        ...JSON.parse(value),
      };
    });
    setSortedChatList(sortedList);
    console.log('sortedList', sortedList);
  }

  const onEndReached = () => {
    if (!noMoreData || !loading) {
      loadData();
    }
  };

  const renderItem = ({ item }: { item: ChatListData }) => (
    <EachChat item={item}/>
  );

  return <View>
    {initLoading && <ActivityIndicator />}
    {sortedChatList.length > 0 && !refresh && <FlatList
      data={sortedChatList}
      keyExtractor={(item) => `createdChat_${item.campaignId.toString()}`}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
    />}
  </View>;
}

export default CreatedChatList;
