import { atom } from 'recoil';
import { UserInfo } from '../@types';

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
