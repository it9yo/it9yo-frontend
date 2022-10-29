import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CloseButton from '@components/Header/CloseButton';
import BackButton from '@src/components/Header/BackButton';
import DetailHome from './DetailHome';
import ViewLocation from './ViewLocation';

const Stack = createNativeStackNavigator();

function CampaignDetail() {
  return (<Stack.Navigator initialRouteName='DetailHome'>
    <Stack.Screen
      name="DetailHome"
      component={DetailHome}
      options={({ navigation }) => ({
        title: '',
        headerLeft: () => <BackButton text="목록가기" onPress={navigation.goBack} />,
      })}
    />
    <Stack.Group
      screenOptions={({ navigation }) => ({
        headerLeft: () => <CloseButton onPress={navigation.goBack} />,
        gestureEnabled: false,
        gestureDirection: 'vertical',
        headerMode: 'float',
      })}
    >
      <Stack.Screen
        name="ViewLocation"
        component={ViewLocation}
        options={{ title: '수령 위치 확인' }}
      />
    </Stack.Group>
  </Stack.Navigator>);
}

export default CampaignDetail;
