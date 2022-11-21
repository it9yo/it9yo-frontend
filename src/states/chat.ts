import { atom } from 'recoil';

export const currentChatRoomId = atom<number | null>({
  key: 'currentChatRoomId',
  default: null,
});

export const unreadRefresh = atom<boolean>({
  key: 'unreadRefresh',
  default: false,
});

export const joinedChatRefresh = atom<boolean>({
  key: 'joinedChatRefresh',
  default: false,
});

export const createdChatRefresh = atom<boolean>({
  key: 'createdChatRefresh',
  default: false,
});
