/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { RecoilRoot } from 'recoil';
import Toast from 'react-native-toast-message';
import App from './App';

import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // eslint-disable-next-line no-console
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return (
    <>
      <RecoilRoot>
        <App />
      </RecoilRoot>
      <Toast />
    </>
  );
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
