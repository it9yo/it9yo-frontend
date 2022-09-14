import { atom } from 'recoil';
import { Location } from '@src/@types';

export const location = atom<Location>({
  key: 'location',
  default: {
    siDo: '',
    siGunGu: '',
  },
});

export default location;
