import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CampaignList from './CampaignList';
import Search from './Search';

const Stack = createNativeStackNavigator();

function Home() {
  return <Stack.Navigator initialRouteName='CampaignList'>
    <Stack.Screen
      name="CampaignList"
      component={CampaignList}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Search"
      component={Search}
    />
  </Stack.Navigator>;
}

export default Home;
