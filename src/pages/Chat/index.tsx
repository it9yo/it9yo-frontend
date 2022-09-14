import React, { useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

const Stack = createNativeStackNavigator();

function Chat({ navigation, route }) {
  useEffect(() => {
    route.state && route.state.index > 0
      ? navigation.setOptions({ tabBarVisible: false }) : navigation.setOptions({ tabBarVisible: true });
  }, []);

  return <Stack.Navigator initialRouteName='ChatList'>
    <Stack.Screen
      name="ChatList"
      component={ChatList}
      options={{
        title: '채팅 목록',
      }}
    />
    <Stack.Screen
      name="ChatRoom"
      component={ChatRoom}
    />
  </Stack.Navigator>;
}

export default Chat;
