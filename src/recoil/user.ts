import { atom } from 'recoil';
import { UserInfo, UserSignUpProps } from '../@types';

export const userAccessToken = atom<string>({
  key: 'userAccessToken',
  default: '',
});

export const userState = atom<UserInfo>({
  key: 'userState',
  default: {
    userId: 0,
    username: '',
    nickName: '',
    phoneNumber: '',
    sido: '',
    sigungu: '',
    profileImageUrl: '',
    providerType: '',
    roleType: '',
    introduction: '',
    badgeType: '',
    point: 0,
    accountNumber: '',
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
    sido: '',
    sigungu: '',
    locationAuth: false,
    mobileToken: '',
    agree: false,
  },
});
