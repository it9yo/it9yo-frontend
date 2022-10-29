import { atom } from 'recoil';

interface WishList {
  id : number;
  userId : number;
  campaignId : number;
}

export const wishList = atom<WishList[]>({
  key: 'wishList',
  default: [],
});

export default wishList;
