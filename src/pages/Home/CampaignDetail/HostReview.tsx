import React, { useEffect, useState } from 'react';
import {
  View, Image, Text, StyleSheet, Pressable, Platform, Dimensions, ActivityIndicator, FlatList, TouchableOpacity, Alert,
} from 'react-native';

import StatusNameList from '@constants/statusname';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { ReviewInfo, CampaignData } from '@src/@types';
import Icon from 'react-native-vector-icons/AntDesign';
import EachReview from '@src/components/EachReview';
import { parse } from 'date-fns/esm';

const pageSize = 10;

function HostReview({ navigation, route }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const { campaignDetail }: { campaignDetail: CampaignData } = route.params;
  const {
    title, hostId, hostNickName, hostProfileUrl,
  } = campaignDetail;

  const [reviewList, setReviewList] = useState<ReviewInfo[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);

  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0.0);

  const rateNum = [1, 2, 3, 4, 5];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `${Config.API_URL}/user/reviews/${hostId}?size=${pageSize}&page=${currentPage}&sort=createdDate&direction=DESC`;
      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        const { avgPoint, campaignComments } = response.data.data;
        const {
          content, first, last, number, empty,
        } = campaignComments;
        if (first) {
          setReviewList([...content]);
          setRating(avgPoint);
        } else {
          setReviewList((prev) => [...prev, ...content]);
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

  const renderItem = ({ item }: { item: ReviewInfo }) => (
    <EachReview item={item} />
  );

  return <View style={styles.container}>

    <View style={styles.hostInfoZone}>
      <View style={styles.hostProfileZone}>
        <Image style={styles.hostProfile} source={{ uri: hostProfileUrl }} />

        <View style={styles.hostTextZone}>

          <Text style={styles.hostNameText}>{hostNickName}</Text>

        </View>
      </View>

      <View style={styles.hostRateZone}>
        <Text style={styles.rateNum}>{rating}</Text>
        <View style={styles.starZone}>
          {rateNum.map((item) => (
            <View
              key={item.toString()}
              style={{ marginHorizontal: 2 }}>
              <Icon name='star' size={16} color={item <= rating ? '#ff9c0c' : '#dfdfdf'}/>
            </View>
          ))}
        </View>
      </View>

    </View>

    <View style={styles.reviewContainer}>

      <Text style={styles.titleText}>후기</Text>

      {/* 후기 리스트 */}
      {reviewList.length > 0 && <FlatList
        data={reviewList}
        keyExtractor={(item) => `userReview_${item.campaignCommentId.toString()}`}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        ListFooterComponent={!noMoreData && loading && <ActivityIndicator />}
      />}
    </View>
    <View style={styles.buttonZone}>
      <TouchableOpacity
        style={StyleSheet.compose(styles.button, styles.buttonActive)}
        onPress={() => navigation.navigate('CreateReview', { ...campaignDetail })}>
        <Text style={styles.buttonText}>후기작성</Text>
      </TouchableOpacity>
    </View>
  </View>;
}

export default HostReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  hostInfoZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
  },
  hostProfileZone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  hostProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  hostTextZone: {
    alignItems: 'flex-start',
  },
  hostNameText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 5,
  },
  hostRateZone: {
    alignItems: 'center',
  },
  rateNum: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.5,
    color: '#000000',
    marginBottom: 8,
  },
  starZone: {
    flexDirection: 'row',
  },
  reviewContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  userCntZone: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  titleText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#121212',
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
