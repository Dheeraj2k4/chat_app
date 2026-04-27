import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import { RootStackParamList } from '../types';
import ConversationScreen from '../screens/ConversationScreen';
import ContactsScreen from '../screens/ContactsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="SelectContact"
        component={ContactsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
