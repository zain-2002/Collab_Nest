import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/HomePage';
import CreateAccount from '../screens/CreateAccount';
import UserScreen from '../screens/UserScreen';
import LoginScreen from '../screens/LoginScreen';
import Check from '../screens/MapNavi';
import Verification from '../screens/Verification';
import PaymentScreen from '../screens/PaymentScreen';
import OfficeDetail from '../screens/OfficeDetail';
import Booking from '../screens/Booking';
import StyledBottom from './BottomNavi';

const Stack = createNativeStackNavigator();

function Stacknavi() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'slide_from_bottom', headerShown: false }} initialRouteName='Intro'>
      <Stack.Screen name="Intro" component={HomePage} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Check" component={Check} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OfficeDetail" component={OfficeDetail} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="BottomTabs" component={StyledBottom} />

    </Stack.Navigator>
  );
}

export default Stacknavi;
