import React, { useEffect, useState } from 'react';
import {
  View, Image, Text, StyleSheet, Pressable, Platform, Dimensions, ActivityIndicator, FlatList, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Touchable,
} from 'react-native';

import { useRecoilState } from 'recoil';
import { userAccessToken } from '@src/states';
import axios from 'axios';
import Config from 'react-native-config';
import { CampaignData, JoinUserInfo } from '@src/@types';
import Icon from 'react-native-vector-icons/Ionicons';

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function CreateReview({ navigation, route }) {
  const accessToken = useRecoilState(userAccessToken)[0];
  const campaignDetail: CampaignData = route.params;
  const {
    campaignId, itemPrice, itemImageURLs, title,
  } = campaignDetail;
  const [rating, setRating] = useState(0);
  const rateNum = [1, 2, 3, 4, 5];

  const [loading, setLoading] = useState(false);

  const [content, setContent] = useState('');

  useEffect(() => {

  }, []);

  const submitRating = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Config.API_URL}/campaign/comment/add/${campaignId}`,
        {
          content,
          point: rating,
          parentCommentId: null,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('알림', '후기 작성이 완료되었습니다.');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

    <View style={styles.campaignInfoZone}>
      <Image style={styles.campaignThumbnail} source={{ uri: itemImageURLs[0] }} />

      <View>

        <Text style={styles.campaignInfoText}>{title}</Text>

        <Text style={styles.campaignInfoText}>{`${numberWithCommas(itemPrice)} 원`}</Text>
      </View>

    </View>

    <View style={styles.reviewContainer}>
      <View style={styles.starZone}>
        {rateNum.map((item) => (
          <TouchableOpacity
            key={item.toString()}
            style={{ marginHorizontal: 2 }}
            onPress={() => setRating(item)}
            >
            <Icon name='star' size={32} color={item <= rating ? '#ff9c0c' : '#dfdfdf'}/>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.reviewInfoText}>별표를 탭하여 평가해 주세요</Text>
      <TextInput
        style={styles.introduceInput}
        onChangeText={setContent}
        placeholder="슈퍼바이저에 대한 경험을 적어주세요"
        placeholderTextColor="#b9b9b9"
        value={content}
        clearButtonMode="while-editing"
        blurOnSubmit={false}
        multiline={true}
      />
    </View>

    <View style={styles.buttonZone}>
      <TouchableOpacity
        style={rating >= 1 ? StyleSheet.compose(styles.button, styles.buttonActive) : styles.button}
        disabled={rating < 1 || loading}
        onPress={submitRating}>
        <Text style={styles.buttonText}>작성</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>;
}

export default CreateReview;

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
  campaignInfoText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#282828',
    marginBottom: 5,
  },
  reviewContainer: {
    padding: 20,
    alignItems: 'center',
  },
  starZone: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reviewInfoText: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#898989',
    marginBottom: 20,
  },
  introduceInput: {
    width: '100%',
    textAlignVertical: 'top',
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
