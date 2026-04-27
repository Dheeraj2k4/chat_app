import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants';
import { useTheme } from '../store/ThemeContext';
import Typography, { FontFamily } from '../constants/typography';
import { Spacing, Radius } from '../constants/theme';
import Avatar from '../components/Common/Avatar';
import SearchBar from '../components/Common/SearchBar';
import { useChatStore } from '../store/ChatContext';
import { Contact, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Group contacts alphabetically by first letter
function groupContacts(contacts: Contact[]): { title: string; data: Contact[] }[] {
  const map: Record<string, Contact[]> = {};
  contacts.forEach((c) => {
    const letter = c.name[0].toUpperCase();
    if (!map[letter]) map[letter] = [];
    map[letter].push(c);
  });
  return Object.keys(map)
    .sort()
    .map((letter) => ({ title: letter, data: map[letter] }));
}

export default function ContactsScreen() {
  const navigation = useNavigation<Nav>();
  const { state, getOrCreateConversation } = useChatStore();
  const { colors, isDark } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return state.contacts;
    const q = search.toLowerCase();
    return state.contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [state.contacts, search]);

  const sections = useMemo(() => groupContacts(filtered), [filtered]);

  const handlePress = (contact: Contact) => {
    const conv = getOrCreateConversation(contact.id);
    navigation.navigate('Conversation', {
      conversationId: conv.id,
      contactId: contact.id,
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable style={styles.logoWrap} onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>New Message</Text>
        <Pressable style={styles.logoWrap} hitSlop={10}>
          <Ionicons name="person-add-outline" size={22} color={colors.icon} />
        </Pressable>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchRow}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search contacts" />
      </View>

      {/* ── Online now strip ── */}
      {!search.trim() && (
        <View style={styles.onlineSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Online now</Text>
          <FlatList
            horizontal
            data={state.contacts.filter((c) => c.isOnline)}
            keyExtractor={(item) => `online_${item.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.onlineList}
            renderItem={({ item }) => (
              <Pressable style={styles.onlineItem} onPress={() => handlePress(item)}>
                <Avatar
                  name={item.name}
                  initials={item.initials}
                  avatarColor={item.avatarColor}
                  size={52}
                  showOnline
                  isOnline
                />
                <Text style={[styles.onlineName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.name.split(' ')[0]}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* ── Alphabetical list ── */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionHeaderText, { color: colors.textSecondary }]}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: colors.background },
              pressed && { backgroundColor: colors.surface },
            ]}
            onPress={() => handlePress(item)}
            android_ripple={{ color: colors.surface }}
          >
            <Avatar
              name={item.name}
              initials={item.initials}
              avatarColor={item.avatarColor}
              size={48}
              showOnline
              isOnline={item.isOnline}
            />
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.textPrimary }]}>{item.name}</Text>
              <Text style={[styles.status, { color: colors.textSecondary }]}>
                {item.isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ── Header ────────────────────────────────────────────
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
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },

  // ── Search ────────────────────────────────────────────
  searchRow: {
    paddingRight: Spacing.lg,
    marginBottom: Spacing.md,
  },

  // ── Online strip ──────────────────────────────────────
  onlineSection: {
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    ...Typography.caption,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  onlineList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  onlineItem: {
    alignItems: 'center',
    gap: 6,
    width: 60,
  },
  onlineName: {
    ...Typography.caption,
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // ── Alphabetical list ─────────────────────────────────
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    backgroundColor: Colors.card,
  },
  sectionHeaderText: {
    ...Typography.caption,
    fontFamily: FontFamily.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  rowPressed: {
    backgroundColor: Colors.surface,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  name: {
    ...Typography.subtitle,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  status: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 48 + Spacing.lg + 14,
  },
});
