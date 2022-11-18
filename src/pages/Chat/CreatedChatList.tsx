/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { ChatListData, ChatRoomData } from '@src/@types';
import EachChat from '@src/components/EachChat';
import AsyncStorage from '@react-native-community/async-storage';
import { IMessage } from 'react-native-gifted-chat';

const pageSize = 50;

function CreatedChatList({ navigation }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const [chatList, setChatList] = useState<ChatRoomData[]>([]);
  const [sortedChatList, setSortedChatList] = useState<ChatListData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    loadData();
    setInitLoading(false);
  }, [isFocused]);

  useEffect(() => {
    async function getLastMessages() {
      const result: ChatListData[] = [];
      for (const chat of chatList) {
        const { campaignId } = chat;
        const prevMessages = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
        const unreadMessages = await AsyncStorage.getItem(`unreadMessages_${campaignId}`);
        if (prevMessages) {
          const messageList: IMessage[] = JSON.parse(prevMessages);
          const recentMessage = messageList[0];
          const { text, createdAt } = recentMessage;
          const lastTime = new Date(createdAt);
          const unread = Number(unreadMessages);
          result.push({
            ...chat, lastTime, lastChat: text, unread,
          });
        }
      }
      if (result.length === 0) return;
      const sortedResult = result.sort((a, b) => b.lastTime.getTime() - a.lastTime.getTime());
      setSortedChatList(sortedResult);
    }
    getLastMessages();
    return () => setSortedChatList([]);
  }, [chatList, isFocused]);

  const loadData = async () => {
    if (noMoreData || loading) return;
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/campaigns?status=RECRUITING&size=${pageSize}&page=${currentPage}&sort=createdDate&direction=ASC&hostId=${userInfo.userId}`;
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
          content, first, last, number, empty,
        } = response.data.data;
        if (empty) return;
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
      keyExtractor={(item) => `createdChat_${item.campaignId.toString()}`}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
    />}
  </View>;
}

export default CreatedChatList;
