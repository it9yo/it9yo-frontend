import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BackButton from '@src/components/Header/BackButton';
import DetailHome from './DetailHome';
import ViewLocation from './ViewLocation';

const Stack = createNativeStackNavigator();

function CampaignDetail() {
  return (<Stack.Navigator initialRouteName='DetailHome'>
    <Stack.Group
      screenOptions={({ navigation }) => ({
        headerLeft: () => <BackButton onPress={navigation.goBack} />,
        gestureDirection: 'vertical',
        headerMode: 'float',
        headerTitleStyle: {
          fontFamily: 'SpoqaHanSansNeo',
          fontSize: 18,
          fontWeight: '700',
          color: '#1f1f1f',
        },
      })}>
      <Stack.Screen
        name="DetailHome"
        component={DetailHome}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="ViewLocation"
        component={ViewLocation}
        options={{ title: '공동구매 수령위치' }}
      />
    </Stack.Group>
  </Stack.Navigator>);
}

export default CampaignDetail;
