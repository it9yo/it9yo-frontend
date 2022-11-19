import { ReviewInfo } from '@src/@types';
import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function EachReview({ item }:{ item: ReviewInfo }) {
  const {
    writerNickName, campaignTitle, createdDate, writerProfileUrl, point, content,
  } = item;
  const rateNum = [1, 2, 3, 4, 5];
  const date = createdDate.split('-').join('.').split('T')[0];
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image style={styles.profileImage} source={{ uri: writerProfileUrl }} />

        <View style={styles.reviewerTextZone}>
          <Text style={styles.reviewerNickname}>{writerNickName}</Text>
          <View style={styles.reviewInfo}>
            <View style={styles.starZone}>
              {rateNum.map((item) => (
                <View
                  key={item.toString()}
                  style={{ marginHorizontal: 2 }}>
                  <Icon name='star' size={16} color={item <= point ? '#e4ba4d' : '#dfdfdf'}/>
                </View>
              ))}
            </View>

            <View style={styles.verticalLine} />

            <Text style={styles.reviewDate}>{date}</Text>
            <View style={styles.verticalLine} />
            <Text style={styles.reviewDate}>{campaignTitle}</Text>

          </View>
        </View>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.reviewContent}>
          {content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    paddingHorizontal: 25,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewerTextZone: {
    justifyContent: 'center',
  },
  reviewerNickname: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#595959',
    marginBottom: 5,
  },
  reviewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starZone: {
    flexDirection: 'row',
  },
  verticalLine: {
    width: 1,
    height: 14,
    marginTop: 1,
    marginHorizontal: 5,
    backgroundColor: '#cfcfcf',
  },
  reviewDate: {
    marginLeft: 2,
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#595959',
  },
  reviewContent: {
    fontFamily: 'SpoqaHanSansNeo',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#3b3b3b',
  },
});

export default EachReview;
