import React, { useEffect, useState } from 'react';
import {
  View, Image, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert,
} from 'react-native';

import StatusNameList from '@constants/statusname';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { JoinUserInfo } from '@src/@types';
import { useIsFocused } from '@react-navigation/native';
import StatusChangeModal from '@src/components/Campaign/StatusChangeModal';
import EachUser from '../../components/EachUser';
import { CampaignData } from '../../@types/index.d';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const pageSize = 20;

function ManageCampaign({ navigation, route }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const campaignData: CampaignData = route.params;
  const { campaignId } = campaignData;

  const [campaignDetail, setCampaignDetail] = useState<CampaignData | undefined>();

  const [modalVisible, setModalVisible] = useState(false);

  const [userList, setUserList] = useState<JoinUserInfo[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerTitle: route.params.title,
      });
      loadCampaignDetail();
      loadData();
      setRefresh(false);
    }
  }, [navigation, route, isFocused]);

  useEffect(() => {
    if (refresh) {
      setLoading(true);
      loadCampaignDetail();
      loadData();
      setLoading(false);
      setRefresh(false);
    }
  }, [refresh]);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/campaign/detail/v2/${campaignId}?size=${pageSize}&page=${currentPage}&sort=createdDate,desc`;
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
      if (response.status !== 200) return;

      const campaign: CampaignData = response.data.data;
      setCampaignDetail(campaign);
    } catch (error) {
      if (error.response.data.message === '캠페인에 참여중인 사용자가 아닙니다.') return;
      console.error(error);
    }
  };

  const onEndReached = () => {
    if (!noMoreData || !loading) {
      loadData();
    }
  };

  const renderItem = ({ item }: { item: JoinUserInfo }) => (
    <EachUser item={item} campaignData={campaignDetail} />
  );
  if (campaignDetail) {
    return <View style={styles.container}>

      <View style={styles.campaignInfoZone}>
        <Image style={styles.campaignThumbnail} source={{ uri: campaignDetail.itemImageURLs[0] }} />

        <View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{StatusNameList[campaignDetail.campaignStatus]}</Text>
          </View>

          <Text style={styles.campaignInfoText}>{campaignDetail.title}</Text>

          <Text style={styles.campaignInfoText}>{`${numberWithCommas(campaignDetail.itemPrice)} 원`}</Text>
        </View>

      </View>

      <View style={styles.userListContainer}>
        {/* 참여중인 인원 */}
        <View style={styles.userCntZone}>
          <Text style={styles.userCntText}>총 </Text>
          <Text style={{ ...styles.userCntText, fontWeight: 'bold' }}>{campaignDetail.participatedPersonCnt}명</Text>
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
      </View>

      <StatusChangeModal
        campaignDetail={campaignData}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setRefresh={setRefresh}
      />

      <View style={styles.buttonZone}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>상태 변경</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={StyleSheet.compose(styles.button, styles.buttonActive)}
          onPress={() => navigation.navigate('ChatRoom', { campaignId, title: campaignDetail.title })}>
          <Text style={styles.buttonText}>공구채팅</Text>
        </TouchableOpacity>
      </View>
    </View>;
  }
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
