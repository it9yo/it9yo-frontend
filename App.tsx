import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { RecoilRoot } from 'recoil';

import AppInner from './AppInner';

function App() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <RecoilRoot>
      <AppInner />
    </RecoilRoot>
  );
}

export default App;
