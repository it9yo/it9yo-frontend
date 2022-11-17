import React, { useEffect, useState } from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import StatusNameList from '@constants/statusname';
import { ChatListData, ChatRoomData } from '@src/@types';
import AsyncStorage from '@react-native-community/async-storage';
import { IMessage } from 'react-native-gifted-chat';

function timeConversion(millisec: number) {
  const seconds = Math.floor(millisec / 1000);

  const minutes = Math.floor(millisec / (1000 * 60));

  const hours = Math.floor(millisec / (1000 * 60 * 60));

  const days = Math.floor(millisec / (1000 * 60 * 60 * 24));

  if (Number(hours) >= 24) {
    return `${days}일`;
  } if (Number(minutes) >= 60) {
    return `${hours}시간`;
  } if (Number(seconds) >= 60) {
    return `${minutes}분`;
  }
  return `${seconds}초`;
}

function EachChat({ item } : { item: ChatListData }) {
  const navigation = useNavigation();
  const [lastChatTime, setLastChatTime] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const {
    campaignId, title, itemImageURLs, lastTime, lastChat, unread,
  } = item;

  useEffect(() => {
    if (lastTime) {
      const lastTimeText = `${timeConversion(new Date().getTime() - lastTime.getTime())} 전`;
      setLastChatTime(lastTimeText);
    }
    if (lastChat) {
      const lastText = lastChat.length > 20 ? `${lastChat.substring(0, 20)}...` : lastChat;
      setLastMessage(lastText);
    }
  }, []);

  return <Pressable onPress={() => navigation.navigate('ChatRoom', { campaignId, title })}>
    <View style={styles.chatListView}>
      <View style={styles.leftContainer}>
        <Image style={styles.chatThumbnail}
          source={{
            uri: itemImageURLs[0],
          }}
        />
        <View style={styles.chatContainer}>
          <Text style={styles.chatTitle}>{title}</Text>
          <Text style={styles.chatContent}>{lastMessage}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.chatTimeText}>{lastChatTime}</Text>
        {unread > 0
          && <View style={styles.badge}>
            <Text style={styles.badgeNum}>{unread}</Text>
          </View>
        }
      </View>
    </View>
  </Pressable>;
}
const styles = StyleSheet.create({
  chatListView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatThumbnail: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  chatContainer: {
    marginLeft: 20,
  },
  chatTitle: {
    fontFamily: 'NotoSansKR',
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: -0.38,
    color: '#404040',
    marginBottom: 2,
  },
  chatContent: {
    fontFamily: 'NotoSansKR',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.33,
    color: '#404040',
  },
  rightContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  chatTimeText: {
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.3,
    color: '#9a9a9a',
    marginBottom: 5,
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#fb5135',
  },
  badgeNum: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: -0.3,
    color: '#ffffff',
  },
});

export default EachChat;
