import React, { useState, useEffect, useRef } from 'react';
import { DrawerLayoutAndroid, View } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import messaging from '@react-native-firebase/messaging';
import { CampaignData, JoinUserInfo, ReceivedMessageData } from '@src/@types';

import { GiftedChat, type IMessage, Bubble } from 'react-native-gifted-chat';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  chatRefresh,
  currentChatRoomId, unreadAll, userAccessToken, userState,
} from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

import DrawerButton from '@components/Header/DrawerButton';
import ChatRoomDrawer from './ChatRoomDrawer';

const pageSize = 50;

function ChatRoom({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const setChatRoomId = useSetRecoilState(currentChatRoomId);
  const [unreadMessages, setUnreadMessages] = useRecoilState(unreadAll);
  const [refresh, setRefresh] = useRecoilState(chatRefresh);

  const { campaignId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  const [userList, setUserList] = useState<JoinUserInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);

  const [campaignData, setCampaignData] = useState<CampaignData | undefined>();

  const drawer = useRef(null);

  useEffect(() => {
    const readMessages = async () => {
      const data = await AsyncStorage.getItem(`lastChat_${campaignId}`);
      console.log(data);
      if (data === null) return;
      const chatListData = JSON.parse(data);
      const { unread } = chatListData;
      if (unread === 0) return;

      const newData = {
        ...chatListData,
        unread: 0,
      };
      await AsyncStorage.multiSet([
        ['unreadAll', String(Number(unreadMessages) - unread)],
        [`lastChat_${campaignId}`, JSON.stringify(newData)],
      ]);
      setUnreadMessages((prev) => Number(prev) - unread);
      setRefresh(true);
    };

    navigation.setOptions({
      headerTitle: route.params.title,
      headerRight: () => <DrawerButton onPress={() => drawer.current.openDrawer()}/>,
    });

    readMessages();
    setChatRoomId(campaignId);
    initChatData();
    loadCampaignDetail();
    loadUserData();

    return () => {
      setChatRoomId(null);
    };
  }, []);

  // useEffect(() => {
  //   if (userList) {
  //     const userWithoutHost = userList.filter((item) => item.userId !== campaignData?.campaignId);
  //   }
  // }, [userList]);

  // 메시지 전송 받기
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { messageId, notification, sentTime } = remoteMessage;
      if (!notification || !notification.body) return;

      const receivedMessage = JSON.parse(notification.body);
      if (receivedMessage.campaignId !== campaignId) return;

      setReceivedMessage({ ...receivedMessage, messageId, sentTime });
    });

    return unsubscribe;
  }, []);

  const initChatData = async () => {
    try {
      const data = await AsyncStorage.getItem(`chat_${campaignId}`);
      if (data === null) return;
      const chatList = JSON.parse(data);

      setMessages(chatList);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCampaignDetail = async () => {
    if (loading) return;
    try {
      const response = await axios.get(
        `${Config.API_URL}/campaign/detail/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (response.status === 200) {
        const campaignDetailData: CampaignData = response.data.data;
        setCampaignData(campaignDetailData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadUserData = async () => {
    if (loading || noMoreData) return;
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/detail/v2/${campaignId}?size=${pageSize}&page=${currentPage}&sort=createdDate&direction=DESC`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        const { userInfos } = response.data.data;
        const {
          content, first, last, number,
        } = userInfos;
        if (first) {
          setUserList([...content]);
        } else {
          setUserList((prev) => [...prev, ...content]);
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

  function renderBubble(props: any) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#FF9E3E',
          },
          left: {
            backgroundColor: '#E3E3E3',
          },
        }}
      />
    );
  }

  const onEndReached = () => {
    if (!noMoreData || !loading) {
      loadUserData();
    }
  };

  const setReceivedMessage = async ({
    messageId,
    sentTime,
    userId,
    nickName,
    content,
    profileImageUrl,
    userChat,
  }: ReceivedMessageData) => {
    if (!sentTime || !messageId) return;

    const newMessage: IMessage = {
      _id: messageId,
      text: content,
      createdAt: new Date(sentTime),
      user: {
        _id: userId,
        name: nickName,
        avatar: profileImageUrl,
      },
      system: !userChat,
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const sendMessage = async (message: IMessage[]) => {
    try {
      const { text } = message[0];
      const response = await axios.post(
        `${Config.API_URL}/chat/publish/${campaignId}`,
        {
          content: text,
          userChat: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="right"
      renderNavigationView={() => (campaignData ? <ChatRoomDrawer
        campaignData={campaignData}
        userList={userList}
        onEndReached={onEndReached}
        noMoreData={noMoreData}
        loading={loading}/> : <View />)
      }>
      <GiftedChat
        messages={messages}
        onSend={(message) => sendMessage(message)}
        user={{
          _id: userInfo.userId,
        }}
        renderBubble={renderBubble}
        renderUsernameOnMessage={true}
        renderAvatarOnTop={true}
      />
    </DrawerLayoutAndroid>
  );
}

export default ChatRoom;
