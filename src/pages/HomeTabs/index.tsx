import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Home from './Home';
import { useRecoilState } from 'recoil';
import { unreadAll } from '@src/states';

import HomeIcon from '@assets/images/home.png';
import PeopleIcon from '@assets/images/people.png';
import MessageIcon from '@assets/images/message.png';
import ProfileIcon from '@assets/images/profile.png';

import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Home from './Home';
import Mypage from './Mypage';
import Chat from './Chat';
import Manage from './Manage';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  const [unreadMessages, setUnreadMessages] = useRecoilState(unreadAll);

  useEffect(() => {
    const getUnreadMessages = async () => {
      const unread = await AsyncStorage.getItem('unreadAll');
      const unreadCnt = Number(unread);
      setUnreadMessages(unreadCnt);
    };

    getUnreadMessages();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Home') {
            return <Image
              style={focused ? styles.tabIcon : { ...styles.tabIcon, opacity: 0.4 }}
              source={HomeIcon}
            />;
          } if (route.name === 'Manage') {
            return <Image
              style={focused ? styles.tabIcon : { ...styles.tabIcon, opacity: 0.4 }}
              source={PeopleIcon}
            />;
          } if (route.name === 'Chat') {
            return <View>
              <Image
                style={focused ? styles.tabIcon : { ...styles.tabIcon, opacity: 0.4 }}
                source={MessageIcon}
              />
              {unreadMessages > 0 && <View style={styles.badge}>
                <Text style={styles.badgeNum}>{unreadMessages}</Text>
              </View>}
            </View>;
          } if (route.name === 'Mypage') {
            return <Image
              style={focused ? styles.tabIcon : { ...styles.tabIcon, opacity: 0.4 }}
              source={ProfileIcon}
            />;
          }
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#ababab',
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="Manage"
        component={Manage}
        options={{
          title: '공구관리',
          tabBarLabel: '공구관리',
        }}
        />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          title: '채팅',
          tabBarLabel: '채팅',
        }}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{
          title: '내 정보',
          tabBarLabel: '내 정보',
        }}
      />
  </Tab.Navigator>);
}

export default HomeTabs;

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#fb5135',
  },
  badgeNum: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: -0.3,
    color: '#ffffff',
  },
});
