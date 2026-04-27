import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
// Text kept for title — icons use react-native-vector-icons
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors } from '../constants';
import Typography, { FontFamily } from '../constants/typography';
import { Spacing, Radius, Shadow } from '../constants/theme';
import ChatListItem from '../components/ChatScreen/ChatListItem';
import { useChatStore } from '../store/ChatContext';
import { RootStackParamList } from '../types';
import { CURRENT_USER_ID } from '../data/mockData';
import SearchBar from '../components/Common/SearchBar';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ChatScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useChatStore();
  const [search, setSearch] = useState('');

  const sortedConversations = useMemo(() => {
    return [...state.conversations]
      .filter((conv) => conv.messages.length > 0)
      .sort((a, b) => {
        const aTs = a.messages[a.messages.length - 1]?.timestamp ?? 0;
        const bTs = b.messages[b.messages.length - 1]?.timestamp ?? 0;
        return bTs - aTs;
      });
  }, [state.conversations]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sortedConversations;
    const q = search.toLowerCase();
    return sortedConversations.filter((conv) => {
      const contact = state.contacts.find((c) => c.id === conv.contactId);
      return contact?.name.toLowerCase().includes(q);
    });
  }, [sortedConversations, search, state.contacts]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Paper-plane logo */}
        <View style={styles.logoWrap}>
          <Entypo name="paper-plane" size={28} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Chat</Text>

        {/* Spacer to keep title centred */}
        <View style={styles.logoWrap} />
      </View>

      {/* ── Search + Gear row ── */}
      <View style={styles.searchRow}>
        <View style={styles.searchFlex}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <Pressable style={styles.gearBtn} hitSlop={10}>
          <Ionicons name="settings-outline" size={24} color={Colors.icon} />
        </Pressable>
      </View>

      {/* ── Chat list ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const contact = state.contacts.find((c) => c.id === item.contactId);
          if (!contact) return null;
          const lastMessage = item.messages[item.messages.length - 1];
          const unreadCount = item.messages.filter(
            (m) => !m.read && m.senderId !== CURRENT_USER_ID
          ).length;
          return (
            <ChatListItem
              contact={contact}
              lastMessage={lastMessage}
              unreadCount={unreadCount}
              onPress={() =>
                navigation.navigate('Conversation', {
                  conversationId: item.id,
                  contactId: item.contactId,
                })
              }
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ── FAB ── */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => navigation.navigate('MainTabs' as any)}
      >
        <Entypo name="paper-plane" size={24} color={Colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  logoWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...Typography.heading,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
  },

  // ── Search row ──────────────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  searchFlex: {
    flex: 1,
  },
  gearBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },


  // ── List ────────────────────────────────────────────
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 52 + Spacing.lg + Spacing.md,
  },
  listContent: {
    paddingBottom: 100,
  },

  // ── FAB ─────────────────────────────────────────────
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },

});