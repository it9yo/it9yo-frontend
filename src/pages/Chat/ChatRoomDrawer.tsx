import React from 'react';
import {
  View, Image, Text, StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';

import StatusNameList from '@constants/statusname';

import { JoinUserInfo } from '@src/@types';
import EachUser from '../../components/EachUser';
import { CampaignData } from '../../@types/index.d';

interface DrawerData {
  campaignData: CampaignData;
  userList: JoinUserInfo[];
  onEndReached: any;
  noMoreData: boolean;
  loading: boolean;
}

const ChatRoomDrawer = ({
  campaignData, userList, onEndReached, noMoreData, loading,
}: DrawerData) => {
  const renderItem = ({ item }: { item: JoinUserInfo }) => (
     <EachUser item={item} campaignData={campaignData} type='drawer' />
  );
  return (<View style={styles.container}>
    <View style={styles.campaignInfoZone}>
      <Image style={styles.campaignThumbnail} source={{ uri: campaignData.itemImageURLs[0] }} />

      <View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{StatusNameList[campaignData.campaignStatus]}</Text>
        </View>

        <Text style={styles.campaignInfoText}>{campaignData.title}</Text>

        {/* <Text style={styles.campaignInfoText}>{`${numberWithCommas(itemPrice)} 원`}</Text> */}
      </View>

    </View>

    <View style={styles.userListContainer}>
      {/* 참여중인 인원 */}
      <View style={styles.userCntZone}>
        <Text style={styles.userCntText}>총 </Text>
        <Text style={{ ...styles.userCntText, fontWeight: 'bold' }}>{campaignData.participatedPersonCnt}명</Text>
        <Text style={styles.userCntText}> 참여중</Text>
      </View>

      {/* 유저 정보 리스트 */}
      {userList.length > 0 && <FlatList
        data={userList}
        keyExtractor={(item) => `userList_${item.userId.toString()}`}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      />}
    </View>

  </View>);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  campaignInfoZone: {
    height: 140,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
  },
  campaignThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  statusBadge: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 17,
    backgroundColor: '#fae5d2',
    marginBottom: 5,
  },
  statusText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#e27919',
  },
  campaignInfoText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 5,
  },
  userListContainer: {
    padding: 20,
  },
  userCntZone: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userCntText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#3b3b3b',
  },
});

export default ChatRoomDrawer;
