import React from 'react';
import { Pressable, SafeAreaView, Text } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useSetRecoilState } from 'recoil';
import { userAccessToken, userState } from '@src/states';

function Mypage() {
  const setUserInfo = useSetRecoilState(userState);
  const setAccessToken = useSetRecoilState(userAccessToken);

  const onLogout = async () => {
    setUserInfo({
      userId: 0,
      username: '',
      providerType: '',
      nickName: '',
      phoneNumber: '',
      siDo: '',
      siGunGu: '',
      locationAuth: false,
      profileImageUrl: '',
      roleType: '',
      introduction: '',
      badgeType: '',
      point: 0,
      accountNumber: '',
      mobileToken: '',
    });
    setAccessToken('');

    await EncryptedStorage.setItem(
      'refreshToken',
      '',
    );
  };
  return (
    <SafeAreaView>
      <Text>마이페이지</Text>
      <Pressable
        onPress={onLogout}
      >
        <Text>로그아웃</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Mypage;
