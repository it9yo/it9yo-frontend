import { atom } from 'recoil';
import { UserInfo, UserSignUpProps } from '../@types';

export const userAccessToken = atom<string>({
  key: 'userAccessToken',
  default: '',
});

export const userFcmToken = atom<string>({
  key: 'userFcmToken',
  default: '',
});

export const userState = atom<UserInfo>({
  key: 'userState',
  default: {
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
  },
});

export const signupState = atom<UserSignUpProps>({
  key: 'signupState',
  default: {
    providerUserId: '',
    providerType: '',
    nickName: '',
    introduction: '',
    phoneNumber: '',
    siDo: '',
    siGunGu: '',
    locationAuth: false,
    agree: false,
  },
});
