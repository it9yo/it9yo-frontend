import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BackButton from '@src/components/Header/BackButton';
import AdditionalInfo from './AdditionalInfo';
import Location from './Location';
import LocationCertification from './LocationCertification';
import PhoneCertification from './PhoneCertification';
import SignupComplete from './SignupComplete';
import Terms from './Terms';

const Stack = createNativeStackNavigator();

function SignUp() {
  return <Stack.Navigator initialRouteName='Location'>
    <Stack.Group
      screenOptions={({ navigation }) => ({
        headerLeft: () => <BackButton onPress={navigation.goBack} />,
        gestureDirection: 'vertical',
        headerMode: 'float',
        title: '',
      })}
    >
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="PhoneCertification" component={PhoneCertification} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfo} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="LocationCertification" component={LocationCertification} />
      <Stack.Screen name="SignupComplete" component={SignupComplete} />
    </Stack.Group>
  </Stack.Navigator>;
}

export default SignUp;
