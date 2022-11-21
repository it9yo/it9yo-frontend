import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

import { ReceivedMessageData } from '@src/@types';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import JoinedChatList from '@pages/Chat/JoinedChatList';
import CreatedChatList from '@pages/Chat/CreatedChatList';
import AsyncStorage from '@react-native-community/async-storage';
import { IMessage } from 'react-native-gifted-chat';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { chatRefresh, currentChatRoomId, unreadAll } from '@src/states';
import ChatMasterCrown from '@assets/images/chat_master.png';

function Chat({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [refresh, setRefresh] = useRecoilState(chatRefresh);

  const [routes] = useState([
    { key: 'joined', title: '참여중' },
    { key: 'created', title: '주최중' },
  ]);

  const chatRoomId = useRecoilState(currentChatRoomId)[0];
  const [unreadMessages, setUnreadMessages] = useRecoilState(unreadAll);

  // 메시지 전송 받기
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { messageId, notification, sentTime } = remoteMessage;
      if (!notification || !notification.body) return;

      const receivedMessage = JSON.parse(notification.body);
      console.log('received message', receivedMessage);
      if (!sentTime || !messageId) return;

      setReceivedMessage({ ...receivedMessage, messageId, sentTime });

      const {
        content, campaignId, campaignTitle, userChat,
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

        if (chatRoomId && chatRoomId === receivedMessage.campaignId) {
          await AsyncStorage.setItem(`lastChat_${campaignId}`, JSON.stringify(chatListData));
        } else {
          chatListData.unread += 1;
          await AsyncStorage.multiSet([
            [`lastChat_${campaignId}`, JSON.stringify(chatListData)],
            ['unreadAll', String(Number(unreadMessages) + 1)],
          ]);
          setUnreadMessages((prev) => Number(prev) + 1);
        }
      }
      if (!chatRoomId || chatRoomId !== receivedMessage.campaignId) {
        Toast.show({
          text1: campaignTitle,
          text2: content,
          onPress: () => {
            Toast.hide();
            navigation.navigate('ChatRoom', { campaignId, title: campaignTitle });
          },
        });
      }
      setRefresh(true);
    });

    return unsubscribe;
  }, [chatRoomId]);

  const setReceivedMessage = async ({
    campaignId,
    messageId,
    sentTime,
    userId,
    nickName,
    content,
    profileImageUrl,
    userChat,
    hostId,
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

  const renderScene = SceneMap({
    joined: JoinedChatList,
    created: CreatedChatList,
  });

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: '#FF9E3E',
            }}
            style={{
              backgroundColor: 'white',
              fontWeight: 'bold',
              shadowOffset: { height: 0, width: 0 },
              shadowColor: 'transparent',
            }}
            pressColor={'transparent'}
            renderLabel={({ route, focused }) => (
              <Text focused={focused} style={{ color: focused ? '#FF9E3E' : '#282828' }}>{route.title}</Text>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crown: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 16,
  },
});

export default Chat;
