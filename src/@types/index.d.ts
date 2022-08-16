import type { IMPData } from 'iamport-react-native';

export declare type CertificationParams = {
  params: IMPData.CertificationData;
  tierCode?: string;
};

export declare type PaymentParams = {
  params: IMPData.PaymentData;
  tierCode?: string;
};

export declare type LocationParams = {
  address: string;
};

export declare type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Certification: CertificationParams | undefined;
  Location: any;
  LocationCertification: LocationParams;
};

export declare type LoggedInParamList = {
  Home: undefined;
  Manage: undefined;
  Chat: undefined;
  Mypage: undefined;
};
