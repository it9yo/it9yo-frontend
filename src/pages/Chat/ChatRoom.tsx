import React, {
  useState, useCallback, useEffect, useLayoutEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import messaging from '@react-native-firebase/messaging';
import { ReceivedMessageData } from '@src/@types';

import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentChatRoomId, userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

function ChatRoom({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const setChatRoomId = useSetRecoilState(currentChatRoomId);

  const { campaignId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.title });
  }, [navigation, route]);

  useEffect(() => {
    setChatRoomId(campaignId);
    initData();
    return () => {
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

      const { userId, body } = receivedMessage;

      const messageData: ReceivedMessageData = {
        userId,
        body,
        messageId,
        sentTime,
      };
      receiveMessage(messageData);
    });

    return unsubscribe;
  }, []);

  const initData = async () => {
    try {
      const list = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
      if (list !== null) {
        setMessages(JSON.parse(list));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const receiveMessage = async ({
    userId, body, messageId, sentTime,
  }: ReceivedMessageData) => {
    if (!sentTime || !messageId) return;

    const newMessage: IMessage = {
      _id: messageId,
      text: body,
      createdAt: new Date(sentTime),
      user: {
        _id: userId,
        name: 'test', // TODO
      },
    };
    AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify([newMessage, ...messages]));
    setMessages((prev) => [newMessage, ...prev]);
  };

  const sendMessage = async (text: string) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/chat/publish/${campaignId}`,
        {
          body: text,
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
  const onSend = useCallback((message: IMessage[]) => {
    console.log(message);
    sendMessage(message[0].text);
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(message) => onSend(message)}
      user={{
        _id: userInfo.userId,
      }}
    />
  );
}

export default ChatRoom;
