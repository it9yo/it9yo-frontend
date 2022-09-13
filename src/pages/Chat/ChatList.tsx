import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView, ScrollView, StyleSheet, Text, View,
} from 'react-native';

const chatList = [
  {
    campaignId: 1,
    campaignTitle: '마카롱 공구해요',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',
  },
  {
    campaignId: 2,
    campaignTitle: '싱싱 꼬막 무침 공구',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',

  },
  {
    campaignId: 3,
    campaignTitle: '상주 곶감 산지 직송',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',

  },
  {
    campaignId: 4,
    campaignTitle: '아라비카 커피 원두',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',

  },
  {
    campaignId: 5,
    campaignTitle: '천안 호두과자',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',

  },
  {
    campaignId: 6,
    campaignTitle: '스테비아 토마토 공구',
    chatContent: '안녕하세요',
    chatTime: '13:09',
    chatThumbnailUrl: 'https://cdn.incheontoday.com/news/photo/201911/118073_110377_567.jpg',

  },

];

function ChatList({ navigation }) {
  const onChatRoom = (campaignId: number, campaignTitle: string) => {
    navigation.navigate('ChatRoom', { campaignId, campaignTitle });
  };

  return <ScrollView>
    {chatList.map(({
      campaignId, campaignTitle, chatContent, chatTime, chatThumbnailUrl,
    }) => <Pressable
      onPress={() => onChatRoom(campaignId, campaignTitle)}
    >
      <View style={styles.chatListView}>
        <Image style={styles.chatThumbnail}
          source={{
            uri: chatThumbnailUrl,
          }}
        />
        <View style={styles.chatListTextView}>
          <Text style={styles.chatTitle}>{campaignTitle}</Text>
          <Text style={styles.chatContent}>{chatContent}</Text>
        </View>
        <View style={styles.chatStateView}>
          <Text>{chatTime}</Text>
        </View>
      </View>
      </Pressable>)}
  </ScrollView>;
}

const styles = StyleSheet.create({
  chatListView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'orange',
  },
  chatListTextView: {

  },
  chatStateView: {
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
    fontFamily: 'Abel',
    fontWeight: 400,
  },
  chatContent: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Abel',
    fontWeight: 400,
  },
});

export default ChatList;
