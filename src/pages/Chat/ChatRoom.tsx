import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import { DrawerLayoutAndroid, View } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import messaging from '@react-native-firebase/messaging';
import { CampaignData, JoinUserInfo, ReceivedMessageData } from '@src/@types';

import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentChatRoomId, userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

// test
import Toast from 'react-native-toast-message';

import DrawerButton from '@components/Header/DrawerButton';
import ChatRoomDrawer from './ChatRoomDrawer';

const pageSize = 50;

function ChatRoom({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const setChatRoomId = useSetRecoilState(currentChatRoomId);

  const { campaignId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  const [userList, setUserList] = useState<JoinUserInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);

  const [campaignData, setCampaignData] = useState<CampaignData | undefined>();

  const drawer = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
      headerRight: () => <DrawerButton onPress={() => drawer.current.openDrawer()}/>,
    });
    const readMessages = async () => {
      const unreadMessages = await AsyncStorage.getItem(`unreadMessages_${campaignId}`);
      const newUnreadMessages = Number(unreadMessages);
      await AsyncStorage.setItem(`unreadMessages_${campaignId}`, '0');

      const unreadAllMessages = await AsyncStorage.getItem('unreadAllMessages');
      const newUnreadAllMessages = Number(unreadAllMessages) - newUnreadMessages;
      await AsyncStorage.setItem('unreadAllMessages', String(newUnreadAllMessages));
    };
    readMessages();
    setChatRoomId(campaignId);
    initChatData();
    loadCampaignDetail();
    loadUserData();

    return async () => {
      setChatRoomId(null);
    };
  }, []);

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
      const data = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
      if (data === null) return;
      const chatList = JSON.parse(data);
      console.log('initChatData', chatList);

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
          content, first, last, number, empty,
        } = userInfos;
        if (empty) return;
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
    const newMessages = [newMessage, ...messages];
    console.log('prevmessages', messages);
    console.log('newMessages', newMessages);
    setMessages((prev) => [newMessage, ...prev]);
    await AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify(newMessages));
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
      console.log(response);
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
      />
    </DrawerLayoutAndroid>
  );
}

export default ChatRoom;
