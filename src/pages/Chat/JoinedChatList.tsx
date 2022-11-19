/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { CampaignData, ChatListData } from '@src/@types';
import EachChat from '@src/components/EachChat';
import AsyncStorage from '@react-native-community/async-storage';
import { IMessage } from 'react-native-gifted-chat';

const pageSize = 50;

function JoinedChatList({ navigation }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [chatList, setChatList] = useState<CampaignData[]>([]);
  const [sortedChatList, setSortedChatList] = useState<ChatListData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    async function getLastMessages() {
      const result: ChatListData[] = [];
      const restResult: ChatListData[] = [];
      for (const chat of chatList) {
        const { campaignId } = chat;
        const prevMessages = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
        const unreadMessages = await AsyncStorage.getItem(`unreadMessages_${campaignId}`);
        if (prevMessages === null) {
          restResult.push({
            ...chat,
          });
        } else {
          const messageList: IMessage[] = JSON.parse(prevMessages);
          console.log(`${campaignId} has ${messageList.length} messages`);
          if (messageList.length > 0) {
            const recentMessage = messageList[0];
            const { text, createdAt } = recentMessage;
            const lastTime = new Date(createdAt);
            const unread = Number(unreadMessages);
            result.push({
              ...chat, lastTime, lastChat: text, unread,
            });
          } else {
            restResult.push({
              ...chat,
            });
          }
        }
      }
      if (result.length === 0 && restResult.length === 0) return;

      let sortedList: ChatListData[] = [];
      if (result.length !== 0) {
        const sortedResult = result.sort((a, b) => b.lastTime.getTime() - a.lastTime.getTime());
        sortedList = [...sortedResult];
      }
      setSortedChatList([...sortedList, ...restResult]);
    }
    setInitLoading(true);
    getLastMessages();
    setInitLoading(false);

    return () => setSortedChatList([]);
  }, [chatList, isFocused]);

  const loadData = async () => {
    if (noMoreData || loading) return;
    try {
      setLoading(true);
      const url = `${Config.API_URL}/chat/joining?size=${pageSize}&page=${currentPage}`;
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
    {sortedChatList.length > 0 && <FlatList
      data={sortedChatList}
      keyExtractor={(item) => `joinedChat_${item.campaignId.toString()}`}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
    />}
  </View>;
}

export default JoinedChatList;
