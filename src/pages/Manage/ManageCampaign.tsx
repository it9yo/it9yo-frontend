import React, { useEffect, useState } from 'react';
import {
  View, Image, Text, StyleSheet, Pressable, Platform, Dimensions, ActivityIndicator, FlatList, TouchableOpacity,
} from 'react-native';

import StatusNameList from '@constants/statusname';
import Icon from 'react-native-vector-icons/Ionicons';

import UserIcon from '@assets/images/user.png';
import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { JoinUserInfo } from '@src/@types';
import EachUser from '../../components/EachUser';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const pageSize = 10;

function ManageCampaign({ navigation, route }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const {
    campaignId, title, hostId, itemPrice, campaignStatus, itemImageURLs, participatedPersonCnt,
  } = route.params;

  const [userList, setUserList] = useState<JoinUserInfo[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
    });
    loadData();
  }, [navigation, route]);

  useEffect(() => {
    console.log('userList', userList);
  }, [userList]);

  const loadData = async () => {
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
        const {
          content, first, last, number, empty,
        } = response.data.data.userInfos;
        if (empty) return;
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

  const onEndReached = () => {
    if (!noMoreData || !loading) {
      loadData();
    }
  };

  const renderItem = ({ item }: { item: JoinUserInfo }) => (
    <EachUser item={item} campaignStatus={campaignStatus} editable={editable} />
  );

  return <View style={styles.container}>

    <View style={styles.campaignInfoZone}>
      <Image style={styles.campaignThumbnail} source={{ uri: itemImageURLs[0] }} />

      <View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{StatusNameList[campaignStatus]}</Text>
        </View>

        <Text style={styles.campaignInfoText}>{title}</Text>

        <Text style={styles.campaignInfoText}>{`${numberWithCommas(itemPrice)} 원`}</Text>
      </View>

    </View>

    <View style={styles.userListContainer}>
      {/* 참여중인 인원 */}
      <View style={styles.userCntZone}>
        <Text style={styles.userCntText}>총 </Text>
        <Text style={{ ...styles.userCntText, fontWeight: 'bold' }}>{participatedPersonCnt}명</Text>
        <Text style={styles.userCntText}> 참여중</Text>
      </View>

      {/* 유저 정보 리스트 */}
      {userList.length > 0 && <FlatList
        data={userList}
        keyExtractor={(item) => `joinedUser_${item.userId.toString()}`}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      />}
      {/* 더미테스트 */}
      {/* {dummyUserList.length > 0 && <FlatList
        data={dummyUserList}
        keyExtractor={(item) => `joinedUser_${item.userId.toString()}`}
        renderItem={renderItem}
        // onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      />} */}
    </View>
    {editable
      ? <View style={styles.buttonZone}>
        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => setEditable((prev) => !prev)}>
          <Text style={styles.buttonText}>완료</Text>
        </TouchableOpacity>
      </View>
      : <View style={styles.buttonZone}>
        <TouchableOpacity style={styles.button} onPress={() => setEditable((prev) => !prev)}>
          <Text style={styles.buttonText}>상태 변경</Text>
        </TouchableOpacity>

        <TouchableOpacity style={StyleSheet.compose(styles.button, styles.buttonActive)}>
          <Text style={styles.buttonText}>공구채팅</Text>
        </TouchableOpacity>
      </View>
    }
  </View>;
}

export default ManageCampaign;

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
  buttonZone: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: '#ababab',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#ff9e3e',
  },
  buttonText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: '700',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
  },
});
