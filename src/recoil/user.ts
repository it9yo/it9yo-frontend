import { atom } from 'recoil';

export interface UserState {
  userId: number,
  username: string,
  nickName: string,
  phoneNumber: string,
  homeAddress: string,
  profileImageUrl: string,
  providerType: string,
  roleType: string,
  introduction: string,
  badgeType: string,
  point: number,
  accountNumber: string
  accessToken: string,
}

export const userState = atom<UserState>({
  key: 'userState',
  default: {
    userId: 0,
    username: '',
    nickName: '',
    phoneNumber: '',
    homeAddress: '',
    profileImageUrl: '',
    providerType: '',
    roleType: '',
    introduction: '',
    badgeType: '',
    point: 0,
    accountNumber: '',
    accessToken: '',
  },
});
