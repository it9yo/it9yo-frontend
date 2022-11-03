import React, {
  useState, useCallback, useEffect, useLayoutEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { useRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

function ChatRoom({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];

  const { campaignId } = route.params;
  const [messages, setMessages] = useState<IMessage[] | undefined>();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.title });
  }, [navigation, route]);

  useEffect(() => {
    initData();
    console.log(userInfo);
  }, []);

  const initData = async () => {
    try {
      const list = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
      if (list !== null) {
        setMessages(JSON.parse(list));
      } else {
        const initMsg: IMessage[] = [{
          _id: 1,
          text: `${userInfo.nickName}님이 입장하셨습니다.`,
          createdAt: new Date(),
          user: {
            _id: 0,
            name: 'React Native',
          },
          system: true,
        }];
        AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify(initMsg));
        setMessages(initMsg);
      }
    } catch (err) {
      console.log(err);
    }
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
    // setMessages((previousMessages) => {
    //   const msgs = GiftedChat.append(previousMessages, message);
    //   AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify(msgs));
    //   return msgs;
    // });
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
