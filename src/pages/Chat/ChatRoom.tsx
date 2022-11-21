import React, { useState, useEffect, useRef } from 'react';
import {
  DrawerLayoutAndroid, Image, StyleSheet, Text, View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import messaging from '@react-native-firebase/messaging';
import { CampaignData, JoinUserInfo, ReceivedMessageData } from '@src/@types';

import {
  GiftedChat, type IMessage, Bubble, BubbleProps, Avatar,
} from 'react-native-gifted-chat';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentChatRoomId, unreadAll, userAccessToken, userState,
} from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';

import DrawerButton from '@components/Header/DrawerButton';
import ChatMasterCrown from '@assets/images/chat_master.png';
import ChatRoomDrawer from './ChatRoomDrawer';

const pageSize = 50;

function ChatRoom({ navigation, route }) {
  const userInfo = useRecoilState(userState)[0];
  const accessToken = useRecoilState(userAccessToken)[0];
  const setChatRoomId = useSetRecoilState(currentChatRoomId);
  const [unreadMessages, setUnreadMessages] = useRecoilState(unreadAll);

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
      setCampaignData(undefined);
    };
  }, []);

  useEffect(() => {
    if (campaignData) {
      console.log('campaignData', campaignData);
    }
  }, [campaignData]);

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
  }, [campaignData]);

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

  function renderBubble(props: BubbleProps<IMessage>) {
    const { currentMessage, previousMessage } = props;
    if (!previousMessage || !previousMessage.user
      || currentMessage.user._id !== previousMessage.user._id) {
      if (props.position === 'left') {
        return <View>
          <Text style={styles.nameText}>{currentMessage.user.name}</Text>
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
        </View>;
      }
    }
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#FF9E3E',
        },
        left: {
          backgroundColor: '#E3E3E3',
        },
      }}
    />;
  }

  function renderSystemMessage(props: any) {
    return <View style={styles.systemMsgContainer}>
      <Text style={styles.systemMsgText}>{props.currentMessage.text}</Text>
    </View>;
  }

  function renderAvatar(props: any) {
    const { currentMessage } = props;

    return <View>
      <Avatar
        {...props}
        containerStyle={{ left: { marginRight: 0 } }}
        />
      {campaignData?.hostId === currentMessage.user._id
        && <Image style={styles.crown} source={ChatMasterCrown} />}
    </View>;
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
        renderSystemMessage={renderSystemMessage}
        renderAvatarOnTop={true}
        timeFormat='HH:mm'
        dateFormat='YYYY년 MM월 DD일'
        renderAvatar={renderAvatar}
      />
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  systemMsgContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 44,
    backgroundColor: '#fff7ef',
    alignSelf: 'center',
    marginBottom: 15,
  },
  systemMsgText: {
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: -0.33,
    color: '#ff9e3e',
  },
  nameText: {
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: -0.3,
    color: '#404040',
    marginBottom: 5,
  },
  crown: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 14,
  },
});

export default ChatRoom;
