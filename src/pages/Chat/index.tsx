import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

const Stack = createNativeStackNavigator();

function Chat() {
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
