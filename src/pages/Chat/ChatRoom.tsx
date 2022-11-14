import React, {
  useState, useCallback, useEffect, useLayoutEffect, useRef,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import messaging from '@react-native-firebase/messaging';
import { ReceivedMessageData } from '@src/@types';

import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentChatRoomId, userAccessToken, userState } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

// test
import Toast from 'react-native-toast-message';

import {
  Button, DrawerLayoutAndroid, StyleSheet, Text, View,
} from 'react-native';

import DrawerButton from '@components/Header/DrawerButton';

function ChatRoom({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const setChatRoomId = useSetRecoilState(currentChatRoomId);

  const { campaignId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  const drawer = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
      headerRight: () => <DrawerButton onPress={() => drawer.current.openDrawer()}/>,
    });
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

      console.log('receivedMessage', receivedMessage);
      const {
        userId, nickName, content, profileImageUrl, userChat,
      } = receivedMessage;

      const messageData: ReceivedMessageData = {
        messageId,
        sentTime,
        userId,
        nickName,
        content,
        profileImageUrl,
        userChat,
      };

      // test
      Toast.show({
        text1: nickName,
        text2: content,
        onPress: () => {
          Toast.hide();
          navigation.navigate('ChatRoom', { campaignId, title: '123' });
        },
      });

      receiveMessage(messageData);
    });

    return unsubscribe;
  }, []);

  const initData = async () => {
    try {
      const list = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
      if (list !== null) {
        setMessages(JSON.parse(list));
      } else {
        const initMsg: IMessage[] = [{
          _id: 0,
          text: `${userInfo.nickName}님이 캠페인에 참여하셨습니다.`,
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

  const receiveMessage = async ({
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
    AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify([newMessage, ...messages]));
    setMessages((prev) => [newMessage, ...prev]);
  };

  const sendMessage = async (text: string) => {
    try {
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
  const onSend = useCallback((message: IMessage[]) => {
    console.log(message);
    sendMessage(message[0].text);
  }, []);

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Text style={styles.paragraph}>I'm in the Drawer!</Text>
      <Button
        title="Close drawer"
        onPress={() => drawer.current.closeDrawer()}
      />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="right"
      renderNavigationView={navigationView}
    >
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: userInfo.userId,
        }}
      />
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default ChatRoom;
