/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { RecoilRoot } from 'recoil';
import Toast from 'react-native-toast-message';

import { AsyncStorage } from '@react-native-community/async-storage';
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
  const prevMessages = await AsyncStorage.getItem(`chatMessages_${campaignId}`);
  if (!prevMessages) return;
  const messageList: IMessage[] = JSON.parse(prevMessages);

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

  const newMessageList: IMessage[] = [newMessage, ...messageList];
  await AsyncStorage.setItem(`chatMessages_${campaignId}`, JSON.stringify(newMessageList));
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { messageId, notification, sentTime } = remoteMessage;
  if (!notification || !notification.body) return;

  const receivedMessage = JSON.parse(notification.body);

  setReceivedMessage({ ...receivedMessage, messageId, sentTime });

  const { campaignId } = receivedMessage;

  const unreadMessages = await AsyncStorage.getItem(`unreadMessages_${campaignId}`);
  const newUnreadMessages = Number(unreadMessages) + 1;
  await AsyncStorage.setItem(`unreadMessages_${campaignId}`, String(newUnreadMessages));

  const unreadAllMessages = await AsyncStorage.getItem('unreadAllMessages');
  const newUnreadAllMessages = Number(unreadAllMessages) + 1;
  await AsyncStorage.setItem('unreadAllMessages', String(newUnreadAllMessages));
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
