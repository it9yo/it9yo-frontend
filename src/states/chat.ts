import { atom } from 'recoil';

export const currentChatRoomId = atom<number | null>({
  key: 'currentChatRoomId',
  default: null,
});

export const unreadAll = atom<number>({
  key: 'unreadAll',
  default: 0,
});

export const chatRefresh = atom<boolean>({
  key: 'chatRefresh',
  default: false,
});
