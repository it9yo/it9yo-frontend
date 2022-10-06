import React from 'react';
import {
  Image,
  Pressable,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';

import StatusNameList from '@constants/statusname';

const chatList = [
  {
    campaignId: 1,
    campaignTitle: '마카롱 공구해요',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'DELIVERED',
    participatedPersonCnt: 5,
  },
  {
    campaignId: 2,
    campaignTitle: '싱싱 꼬막 무침 공구',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'COMPLETED',
    participatedPersonCnt: 5,

  },
  {
    campaignId: 3,
    campaignTitle: '상주 곶감 산지 직송',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'DISTRIBUTING',
    participatedPersonCnt: 5,

  },
  {
    campaignId: 4,
    campaignTitle: '아라비카 커피 원두',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'DELIVERING',
    participatedPersonCnt: 5,

  },
  {
    campaignId: 5,
    campaignTitle: '천안 호두과자',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'CANCELED',
    participatedPersonCnt: 5,

  },
  {
    campaignId: 6,
    campaignTitle: '스테비아 토마토 공구',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
    campaignStatus: 'CONFIRM',
    participatedPersonCnt: 5,

  },

];

function ChatList({ navigation }) {
  const onChatRoom = (campaignId: number, campaignTitle: string) => {
    navigation.navigate('ChatRoom', { campaignId, campaignTitle });
  };

  return <ScrollView style={styles.container}>
    {chatList.map(({
      campaignId, campaignTitle, chatContent, chatTime,
      chatThumbnailUrl, campaignStatus, participatedPersonCnt,
    }) => <Pressable
      key={campaignId.toString()}
      onPress={() => onChatRoom(campaignId, campaignTitle)}
    >
      <View style={styles.chatListView}>
        <Image style={styles.chatThumbnail}
          source={{
            uri: chatThumbnailUrl,
          }}
        />
        <View>
          <Text style={styles.chatTitle}>{campaignTitle}</Text>
          <Text style={styles.chatContent}>{chatContent}</Text>
        </View>
        <View style={styles.chatStateView}>
          <Text>{chatTime}</Text>
          <Text style={styles.campaignStatusText}>{StatusNameList[campaignStatus]}</Text>
          <Text style={styles.joinedPeopleText}>{`${participatedPersonCnt}명 참여중`}</Text>
        </View>
      </View>
      </Pressable>)}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: StyleSheet.hairlineWidth,
    height: '100%',
  },
  chatListView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  campaignStatusText: {
    color: 'red',
    paddingTop: 5,
  },
  joinedPeopleText: {
    color: 'orange',
    paddingTop: 5,
  },
  chatStateView: {
    alignItems: 'flex-end',
    fontFamily: 'Proxima Nova',
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 14,
  },
  chatThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '400',
    color: 'black',
  },
  chatContent: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '400',
    color: 'gray',
  },
});

export default ChatList;
