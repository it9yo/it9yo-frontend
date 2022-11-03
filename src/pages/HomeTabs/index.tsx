import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Home from './Home';
import CampaignList from '@pages/Home/CampaignList';
import { useRecoilState } from 'recoil';
import { location } from '@src/states';
import Manage from './Manage';
import Chat from './Chat';
import Mypage from './Mypage';
import Home from './Home';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          const iconSize = route.name === 'Manage' ? 32 : size;
          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Manage') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Mypage') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: '홈',
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
      <Tab.Screen
        name="Manage"
        component={Manage}
        options={{
          title: '캠페인관리',
          tabBarLabel: '캠페인관리',
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
        />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          title: '채팅 목록',
          tabBarLabel: '채팅',
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{
          title: '내 정보',
          tabBarLabel: '내정보',
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
  </Tab.Navigator>);
}

export default HomeTabs;
