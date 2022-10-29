import React from 'react';
import {
  Image, Pressable, StyleSheet, Text, View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import StatusNameList from '@constants/statusname';
import { ChatRoomData } from '@src/@types';

function EachChatRoom({ item } : { item: ChatRoomData }) {
  const navigation = useNavigation();

  const {
    campaignId, campaignTitle, thumbNail, campaignStatus, campaignParticipatedPersonCnt,
    hostId, chatRoomName, chatRoomParticipatedPersonCnt,
  } = item;

  return <Pressable onPress={() => navigation.navigate('ChatRoom', { campaignId, campaignTitle })}>
    <View style={styles.chatListView}>
      <Image style={styles.chatThumbnail}
        source={{
          uri: thumbNail,
        }}
      />
      <View>
        <Text style={styles.chatTitle}>{campaignTitle}</Text>
        {/* <Text style={styles.chatContent}>{chatContent}</Text> */}
      </View>
      <View style={styles.chatStateView}>
        {/* <Text>{chatTime}</Text> */}
        <Text style={styles.campaignStatusText}>{StatusNameList[campaignStatus]}</Text>
        <Text style={styles.joinedPeopleText}>{`${campaignParticipatedPersonCnt}명 참여중`}</Text>
      </View>
    </View>
  </Pressable>;
}
const styles = StyleSheet.create({
  chatListView: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: 'white',
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
  chatStateView: {
    alignItems: 'flex-end',
    fontFamily: 'Proxima Nova',
    position: 'absolute',
    top: 15,
    right: 15,
    fontSize: 14,
  },
  campaignStatusText: {
    color: 'red',
    paddingTop: 5,
  },
  joinedPeopleText: {
    color: 'orange',
    paddingTop: 5,
  },
});
