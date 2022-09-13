import React, { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdditionalInfo from './AdditionalInfo';
import Location from './Location';
import LocationCertification from './LocationCertification';
import PhoneCertification from './PhoneCertification';
import SignupComplete from './SignupComplete';
import Terms from './Terms';

const Stack = createNativeStackNavigator();

function SignUp() {
  return <Stack.Navigator initialRouteName='Terms'>
    <Stack.Screen
    name="Terms"
    component={Terms}
    options={{
      title: '약관 동의',
      headerLeft: () => (
        <></>
      ),
    }}
    />
    <Stack.Screen
      name="AdditionalInfo"
      component={AdditionalInfo}
      options={{
        title: '추가 정보 입력',
        headerLeft: () => (
        <></>
        ),
      }}
    />
    <Stack.Screen
      name="PhoneCertification"
      component={PhoneCertification}
      options={{
        title: '전화 번호 인증',
        headerLeft: () => (
        <></>
        ),
      }}
    />
    <Stack.Screen
      name="Location"
      component={Location}
      options={{
        title: '지역 설정',
        headerLeft: () => (
        <></>
        ),
      }}
    />
    <Stack.Screen
      name="LocationCertification"
      component={LocationCertification}
      options={{
        title: '지역 인증',
        headerLeft: () => (
        <></>
        ),
      }}
    />
    <Stack.Screen
      name="SignupComplete"
      component={SignupComplete}
      options={{
        title: '회원가입 완료',
        headerLeft: () => (
        <></>
        ),
      }}
    />
  </Stack.Navigator>;
}

export default SignUp;
