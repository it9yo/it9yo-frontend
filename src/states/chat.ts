import { atom } from 'recoil';

export const currentChatRoomId = atom<number | null>({
  key: 'currentChatRoomId',
  default: null,
});

export const unreadAll = atom<number>({
  key: 'unreadAll',
  default: 0,
});

export const joinedChatRefresh = atom<boolean>({
  key: 'joinedChatRefresh',
  default: false,
});

export const createdChatRefresh = atom<boolean>({
  key: 'createdChatRefresh',
  default: false,
});
