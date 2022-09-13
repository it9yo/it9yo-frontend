import React, {
  useState, useCallback, useEffect, useLayoutEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { GiftedChat, type IMessage } from 'react-native-gifted-chat';

function ChatRoom({ navigation, route }) {
  const { campaignId } = route.params;
  const [messages, setMessages] = useState<IMessage[] | undefined>();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.campaignTitle });
  }, [navigation, route]);

  useEffect(() => {
    initData();
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

  const onSend = useCallback((message: IMessage[]) => {
    setMessages((previousMessages) => {
      const msgs = GiftedChat.append(previousMessages, message);
      AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify(msgs));
      return msgs;
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(message) => onSend(message)}
      user={{
        _id: 1,
      }}
    />
  );
}

export default ChatRoom;
