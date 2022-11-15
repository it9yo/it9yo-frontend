import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, StyleSheet, Text, useWindowDimensions,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

import { ReceivedMessageData } from '@src/@types';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import JoinedChatList from '@pages/Chat/JoinedChatList';
import CreatedChatList from '@pages/Chat/CreatedChatList';
import AsyncStorage from '@react-native-community/async-storage';
import { IMessage } from 'react-native-gifted-chat';
import { useRecoilState } from 'recoil';
import { currentChatRoomId } from '@src/states';

function Chat({ navigation }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'joined', title: '참여중' },
    { key: 'created', title: '주최중' },
  ]);

  const chatRoomId = useRecoilState(currentChatRoomId)[0];

  useEffect(() => {
    console.log('chatRoomId', chatRoomId);
  }, [chatRoomId]);

  // 메시지 전송 받기
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const { messageId, notification, sentTime } = remoteMessage;
      if (!notification || !notification.body) return;

      const receivedMessage = JSON.parse(notification.body);
      if (chatRoomId && chatRoomId === receivedMessage.campaignId) return;

      setReceivedMessage({ ...receivedMessage, messageId, sentTime });
      const {
        nickName, content, campaignId, campaignTitle,
      } = receivedMessage;

      Toast.show({
        text1: nickName,
        text2: content,
        onPress: () => {
          Toast.hide();
          navigation.navigate('ChatRoom', { campaignId, title: campaignTitle });
        },
      });
    });

    return unsubscribe;
  }, []);

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
});

export default Chat;
