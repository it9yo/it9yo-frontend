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
  Terms: undefined;
  AdditionalInfo: undefined;
  PhoneCertification: undefined;
  Location: undefined;
  LocationCertification: {
    sido: string | null;
    sigungu: string | null;
  };
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
}

export interface UserInfo {
  userId: number;
  username: string | null;
  nickName: string;
  phoneNumber: string | null;
  sido: string | null;
  sigungu: string | null;
  profileImageUrl: string | null;
  providerType: string;
  roleType: string;
  introduction: string;
  badgeType: string;
  point: number;
  accountNumber: string | null;
}

export interface UserInfoProps {
  data:{
    data: {
      user: UserInfo;
    }
  }
}

export interface UserSignUpProps {
  data:{
    data: {
      accessToken: string;
      refreshToken: string;
      user: UserInfo;
    }
  }
}

export interface NaverKeyProps {
  kConsumerKey: string;
  kConsumerSecret: string;
  kServiceAppName: string;
  kServiceAppUrlScheme?: string;
}
