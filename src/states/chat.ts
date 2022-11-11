import { atom } from 'recoil';

// eslint-disable-next-line import/prefer-default-export
export const currentChatRoomId = atom<number | null>({
  key: 'currentChatRoomId',
  default: null,
});
