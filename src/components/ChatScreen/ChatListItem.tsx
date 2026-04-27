import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../constants';
import Typography, { FontFamily } from '../../constants/typography';
import { Spacing } from '../../constants/theme';
import { Contact, Message } from '../../types';
import { CURRENT_USER_ID } from '../../data/mockData';
import Avatar from '../Common/Avatar';

interface ChatListItemProps {
  contact: Contact;
  lastMessage?: Message;
  unreadCount: number;
  onPress: () => void;
}

// Format as "6.24" — matching the design
function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const date = new Date(ts);

  if (diff < 24 * 60 * 60 * 1000) {
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}.${m}`;
  }
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  }
  return `${date.getDate()}.${date.getMonth() + 1}`;
}

export default function ChatListItem({
  contact,
  lastMessage,
  unreadCount,
  onPress,
}: ChatListItemProps) {
  const isUnread = unreadCount > 0;

  const preview = lastMessage?.imageUri
    ? '📷 Photo'
    : lastMessage?.fileName
    ? `📎 ${lastMessage.fileName}`
    : lastMessage?.text ?? '';

  // Show "You: " prefix when last message is from me
  const isLastMine = lastMessage?.senderId === CURRENT_USER_ID;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      android_ripple={{ color: Colors.surface }}
    >
      {/* Avatar with coral ring when unread */}
      <Avatar
        name={contact.name}
        initials={contact.initials}
        avatarColor={contact.avatarColor}
        size={52}
        showOnline={false}
        ringColor={isUnread ? Colors.accent : undefined}
      />

      {/* Text body */}
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {contact.name}
          </Text>
          {lastMessage && (
            <Text style={[styles.time, isUnread && styles.timeUnread]}>
              {formatTime(lastMessage.timestamp)}
            </Text>
          )}
        </View>

        <Text
          style={[styles.preview, isUnread && styles.previewUnread]}
          numberOfLines={1}
        >
          {isLastMine ? `You: ${preview}` : preview}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  pressed: {
    backgroundColor: Colors.surface,
  },
  body: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
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
  timeUnread: {
    color: Colors.textMuted,
    fontFamily: FontFamily.medium,
  },
  preview: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  previewUnread: {
    color: Colors.textSecondary,
  },
});
