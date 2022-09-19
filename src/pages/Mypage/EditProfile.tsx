import { userState } from '@src/states';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useRecoilState } from 'recoil';

function EditProfile({ navigation }) {
  const [userInfo, setUserInfo] = useRecoilState(userState);

  return (<SafeAreaView style={styles.container}>
    <Text>{userInfo.nickName}</Text>
    <Text>{userInfo.introduction}</Text>
    <Text>{userInfo.siDo}</Text>
    <Text>{userInfo.siGunGu}</Text>
  </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default EditProfile;
