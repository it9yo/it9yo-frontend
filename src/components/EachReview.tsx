import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

function EachReview() {
  const rateNum = [1, 2, 3, 4, 5];
  const rating = 4;
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image style={styles.profileImage} source={{ uri: 'https://cdn.vectorstock.com/i/1000x1000/17/61/male-avatar-profile-picture-vector-10211761.webp' }} />

        <View style={styles.reviewerTextZone}>
          <Text style={styles.reviewerNickname}>1234</Text>
          <View style={styles.reviewInfo}>
            <View style={styles.starZone}>
              {rateNum.map((item) => (
                <View
                  key={item.toString()}
                  style={{ marginHorizontal: 2 }}>
                  <Icon name='star' size={16} color={item <= rating ? '#e4ba4d' : '#dfdfdf'}/>
                </View>
              ))}
            </View>

            <View style={styles.verticalLine} />

            <Text style={styles.reviewDate}>22.07.20</Text>

          </View>
        </View>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.reviewContent}>
          너무 친철하시고 배송도 꼼꼼해서 좋았어요 다음에도 공구하면 좋을거같아요 맛있게 잘멋었 ...더보기
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
