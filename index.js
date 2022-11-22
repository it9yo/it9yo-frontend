/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { RecoilRoot } from 'recoil';
import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-community/async-storage';
import { IMessage } from 'react-native-gifted-chat';
import { ReceivedMessageData } from './src/@types';
import { name as appName } from './app.json';
import App from './App';

const setReceivedMessage = async ({
  campaignId,
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

  const prevData = await AsyncStorage.getItem(`chat_${campaignId}`);
  let newMessages;
  if (prevData !== null) {
    const prevMessages = JSON.parse(prevData);
    newMessages = [newMessage, ...prevMessages];
  } else {
    newMessages = [newMessage];
  }

  await AsyncStorage.setItem(`chat_${campaignId}`, JSON.stringify(newMessages));
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { messageId, notification, sentTime } = remoteMessage;
  if (!notification || !notification.body) return;

  const receivedMessage = JSON.parse(notification.body);
  console.log('background message received', receivedMessage);
  if (!sentTime || !messageId) return;

  setReceivedMessage({ ...receivedMessage, messageId, sentTime });

  const {
    content, campaignId, userChat,
  } = receivedMessage;

  if (userChat) {
    let chatListData = {
      content: '',
      unread: 0,
      sentTime: 0,
    };

    const data = await AsyncStorage.getItem(`lastChat_${campaignId}`);
    if (data !== null) {
      chatListData = JSON.parse(data);
    }
    chatListData.content = content;
    chatListData.sentTime = sentTime;

    chatListData.unread += 1;

    const unreadData = await AsyncStorage.getItem('unreadAll');
    let unreadAll;
    if (unreadData === null) {
      unreadAll = 0;
    } else {
      unreadAll = Number(unreadData);
    }
    await AsyncStorage.multiSet([
      [`lastChat_${campaignId}`, JSON.stringify(chatListData)],
      ['unreadAll', String(unreadAll + 1)],
    ]);
  }
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return (
    <>
      <RecoilRoot>
        <App />
      </RecoilRoot>
      <Toast />
    </>
  );
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
