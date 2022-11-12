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
        gestureEnabled: false,
        gestureDirection: 'vertical',
        headerMode: 'float',
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
