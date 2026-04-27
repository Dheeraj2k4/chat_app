import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants';
import Typography, { FontFamily } from '../constants/typography';
import { Spacing, Radius, Shadow } from '../constants/theme';
import Avatar from '../components/Common/Avatar';
import { useChatStore } from '../store/ChatContext';
import { RootStackParamList } from '../types';
import { CURRENT_USER_ID } from '../data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatTime(ts: number): string {
  const date = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  if (diff < 24 * 60 * 60 * 1000) return `${h}.${m}`;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  return `${day} ${h}.${m}`;
}

export default function BookmarksScreen() {
  const navigation = useNavigation<Nav>();
  const { state, toggleBookmark, isBookmarked } = useChatStore();

  const bookmarked = state.conversations.filter((c) =>
    isBookmarked(c.id)
  );

  if (bookmarked.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.header}>
          <View style={styles.spacer} />
          <Text style={styles.title}>Bookmarks</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bookmark-outline" size={48} color={Colors.border} />
          </View>
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptySub}>
            Open a chat and tap the bookmark icon to save it here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.spacer} />
        <Text style={styles.title}>Bookmarks</Text>
        <View style={styles.spacer} />
      </View>

      <FlatList
        data={bookmarked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const contact = state.contacts.find((c) => c.id === item.contactId);
          if (!contact) return null;
          const lastMsg = item.messages[item.messages.length - 1];
          const preview = lastMsg?.imageUri
            ? '📷 Photo'
            : lastMsg?.fileName
            ? `📎 ${lastMsg.fileName}`
            : lastMsg?.text ?? '';
          const isLastMine = lastMsg?.senderId === CURRENT_USER_ID;

          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() =>
                navigation.navigate('Conversation', {
                  conversationId: item.id,
                  contactId: item.contactId,
                })
              }
              android_ripple={{ color: Colors.surface }}
            >
              {/* Card */}
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Avatar
                    name={contact.name}
                    initials={contact.initials}
                    avatarColor={contact.avatarColor}
                    size={44}
                    showOnline
                    isOnline={contact.isOnline}
                  />
                  <View style={styles.cardBody}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.name} numberOfLines={1}>
                        {contact.name}
                      </Text>
                      {lastMsg && (
                        <Text style={styles.time}>
                          {formatTime(lastMsg.timestamp)}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.preview} numberOfLines={2}>
                      {isLastMine ? `You: ${preview}` : preview}
                    </Text>
                  </View>
                </View>

                {/* Remove bookmark */}
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => toggleBookmark(item.id)}
                  hitSlop={10}
                >
                  <Ionicons name="bookmark" size={20} color={Colors.primary} />
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
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
    paddingBottom: Spacing.md,
  },
  spacer: { width: 36 },
  title: {
    ...Typography.heading,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
  },

  // ── Empty state ──────────────────────────────────────
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    ...Typography.subtitle,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
  },
  emptySub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── List ────────────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  separator: {
    height: Spacing.md,
  },
  row: {
    borderRadius: Radius.lg,
  },
  rowPressed: {
    opacity: 0.85,
  },

  // ── Card ─────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  cardTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    ...Typography.subtitle,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  preview: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  removeBtn: {
    padding: 4,
    marginLeft: Spacing.sm,
  },
});
