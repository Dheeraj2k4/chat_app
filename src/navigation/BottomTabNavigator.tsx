import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatScreen from '../screens/ChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import { Colors } from '../constants';
import { FontFamily } from '../constants/typography';
import { Spacing } from '../constants/theme';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ─── SVG-free custom icons ────────────────────────────────────────────────────

function ChatIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[iconStyles.bubble, focused && iconStyles.bubbleActive]}>
      <View style={[iconStyles.bubbleTail, focused && iconStyles.bubbleTailActive]} />
    </View>
  );
}

function ContactsIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.iconActive : Colors.icon;
  return (
    <View style={iconStyles.peopleWrap}>
      {/* back person */}
      <View style={[iconStyles.headSm, { backgroundColor: color, right: -4, top: 0 }]} />
      <View style={[iconStyles.bodySm, { backgroundColor: color, right: -6, bottom: 0 }]} />
      {/* front person */}
      <View style={[iconStyles.headMd, { backgroundColor: color }]} />
      <View style={[iconStyles.bodyMd, { backgroundColor: color }]} />
    </View>
  );
}

function BookmarksIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.iconActive : Colors.icon;
  return (
    <View style={[iconStyles.book, { borderColor: color }]}>
      <View style={[iconStyles.bookSpine, { backgroundColor: color }]} />
    </View>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.iconActive,
        tabBarInactiveTintColor: Colors.icon,
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => <ChatIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ focused }) => <ContactsIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: ({ focused }) => <BookmarksIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
});

const iconStyles = StyleSheet.create({
  // Chat bubble icon
  bubble: {
    width: 26,
    height: 22,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: Colors.icon,
    position: 'relative',
  },
  bubbleActive: {
    borderColor: Colors.iconActive,
    backgroundColor: Colors.iconActive,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    left: 4,
    width: 8,
    height: 8,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: Colors.icon,
    transform: [{ rotate: '-30deg' }],
  },
  bubbleTailActive: {
    borderColor: Colors.iconActive,
  },

  // Contacts (people) icon
  peopleWrap: {
    width: 28,
    height: 24,
    position: 'relative',
  },
  headSm: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 1,
    right: 2,
  },
  bodySm: {
    position: 'absolute',
    width: 12,
    height: 8,
    borderRadius: 4,
    bottom: 0,
    right: 0,
  },
  headMd: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 0,
    left: 4,
  },
  bodyMd: {
    position: 'absolute',
    width: 16,
    height: 10,
    borderRadius: 5,
    bottom: 0,
    left: 0,
  },

  // Book icon
  book: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  bookSpine: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 2,
  },
});
