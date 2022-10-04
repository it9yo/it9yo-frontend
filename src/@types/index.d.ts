import type { IMPData } from 'iamport-react-native';

export declare type CertificationParams = {
  params: IMPData.CertificationData;
  tierCode?: string;
};

export declare type PaymentParams = {
  params: IMPData.PaymentData;
  tierCode?: string;
};

export declare type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export declare type SignUpParamList = {
  Terms: undefined;
  AdditionalInfo: undefined;
  PhoneCertification: undefined;
  Location: undefined;
  LocationCertification: undefined;
  SignupComplete: undefined;
};

export declare type LoggedInParamList = {
  Home: undefined;
  Manage: undefined;
  Chat: undefined;
  Mypage: undefined;
};

export interface UserAuthenticationProps {
  id: string;
  providerType: string;
  mobilToken?: string;
}

export interface UserInfo {
  userId: number;
  username: string | null;
  providerType: string;
  nickName: string;
  phoneNumber: string | null;
  siDo: string | null;
  siGunGu: string | null;
  locationAuth: boolean;
  profileImageUrl: string | null;
  roleType: string;
  introduction: string;
  badgeType: string;
  point: number;
  accountNumber: string | null;
  mobileToken: string | null;
}

export interface UserInfoProps {
  data:{
    data: {
      user: UserInfo;
    }
  }
}

export interface UserSignUpProps {
  providerUserId: string;
  providerType: string;
  nickName: string;
  introduction: string;
  phoneNumber: string; // '-' 를 붙여줘야 하는지
  siDo: string;
  siGunGu: string;
  locationAuth: boolean;
  agree: boolean;
}

export interface Location {
  siDo: string;
  siGunGu: string;
}

export interface NaverKeyProps {
  kConsumerKey: string;
  kConsumerSecret: string;
  kServiceAppName: string;
  kServiceAppUrlScheme?: string;
}

export interface CampaignDetailData {
  campaignId: number;
  title: string;
  tags: string[];
  description: string;
  itemPrice: number;
  itemImageURLs: string[];
  siDo: string;
  siGunGu: string;
  eupMyeonDong: string;
  detailAddress: string;
  deadLine: string;
  campaignStatus: string;
  participatedPersonCnt: number;
  totalOrderedItemCnt: number;
  pageLinkUrl: string;
  maxQuantityPerPerson: number;
  minQuantityPerPerson: number;
  hostId: number;
  hostName: string;
  campaignCategory: string;
  chatRoomId: number;
}

export interface CampaignListData {
  campaignId: number;
  title: string;
  tags: string[];
  description: string;
  itemPrice: number;
  itemImageURLs: string[];
  siDo: string;
  siGunGu: string;
  eupMyeonDong: string;
  detailAddress: string;
  deadLine: string;
  campaignStatus: string;
  participatedPersonCnt: number;
  totalOrderedItemCnt: number;
  pageLinkUrl: string;
  maxQuantityPerPerson: number;
  minQuantityPerPerson: number;
  hostId: number;
  hostName: string;
  campaignCategory: string;
  chatRoomName: string;
  chatRoomParticipatedPersonCnt: number;
}
