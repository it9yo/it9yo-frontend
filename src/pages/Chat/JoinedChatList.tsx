import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { useRecoilState } from 'recoil';
import { ChatRoomData } from '@src/@types';
import EachChat from '@src/components/EachChat';

const pageSize = 20;

function JoinedChatList({ navigation }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const [chatList, setChatList] = useState<ChatRoomData[]>([]); // TODO

  const [currentPage, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    loadData(0, pageSize);

    return setChatList([]);
  }, [isFocused]);

  const loadData = async (page: number, size: number) => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/chat/joining?size=${size}&page=${page}&sort=createdDate&direction=DESC`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200 && response.data.data.numberOfElements > 0) {
        const { content } = response.data.data;
        content.map((item: ChatRoomData) => setChatList((prev) => [...prev, item]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return <ScrollView style={styles.container}>
    {chatList.map((item) => <EachChat key={item.campaignId.toString()} item={item} />)}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: StyleSheet.hairlineWidth,
    height: '100%',
  },
});

export default JoinedChatList;
