import React from 'react';
import IMP from 'iamport-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../@types';

import { getUserCode } from '../constants/utils';

import Loading from './Loading';

type Props = NativeStackScreenProps<RootStackParamList, 'Certification'>;

function Certification({ route, navigation }: Props) {
  const params = route.params?.params;
  const tierCode = route.params?.tierCode;
  const userCode = getUserCode('danal', tierCode, 'certification');

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <IMP.Certification
        userCode={userCode}
        tierCode={tierCode}
        data={params!}
        loading={<Loading />}
        callback={(response) => navigation.replace('Location', response)
        }
      />
    </SafeAreaView>
  );
}

export default Certification;
