import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants';
import { FontFamily } from '../../constants/typography';
import { Message, Contact } from '../../types';
import { CURRENT_USER_ID } from '../../data/mockData';
import Avatar from '../Common/Avatar';

interface Props {
  message: Message;
  contact: Contact; // the other person in this conversation
}

// Format: "Mon 5.10" or "6.22" matching the design
function formatTime(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  if (isToday) return `${h}.${m}`;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  return `${day} ${h}.${m}`;
}

export default function MessageBubble({ message, contact }: Props) {
  const isMe = message.senderId === CURRENT_USER_ID;
  const timeLabel = formatTime(message.timestamp);

  if (isMe) {
    // ── Outgoing: [timestamp left] [bubble] [my avatar right] ──
    return (
      <View style={styles.rowMe}>
        {/* timestamp floats left of the bubble */}
        <Text style={styles.tsLeft}>{timeLabel}</Text>

        <View style={styles.bubbleMe}>
          {message.imageUri ? (
            <Image source={{ uri: message.imageUri }} style={styles.image} resizeMode="cover" />
          ) : null}
          {message.fileName && !message.imageUri ? (
            <View style={styles.fileRow}>
              <Ionicons name="attach" size={14} color={Colors.textSecondary} />
              <Text style={styles.text}> {message.fileName}</Text>
            </View>
          ) : null}
          {message.text ? (
            <Text style={styles.text}>{message.text}</Text>
          ) : null}
        </View>

        {/* small "me" avatar — orange circle with M */}
        <View style={styles.myAvatarWrap}>
          <View style={styles.myAvatar}>
            <Text style={styles.myAvatarText}>M</Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Incoming: [their avatar] [bubble] [timestamp right] ──
  return (
    <View style={styles.rowThem}>
      <View style={styles.avatarWrap}>
        <Avatar
          name={contact.name}
          initials={contact.initials}
          avatarColor={contact.avatarColor}
          size={30}
        />
      </View>

      <View style={styles.bubbleThem}>
        {message.imageUri ? (
          <Image source={{ uri: message.imageUri }} style={styles.image} resizeMode="cover" />
        ) : null}
        {message.fileName && !message.imageUri ? (
          <View style={styles.fileRow}>
            <Ionicons name="attach" size={14} color={Colors.textSecondary} />
            <Text style={styles.text}> {message.fileName}</Text>
          </View>
        ) : null}
        {message.text ? (
          <Text style={styles.text}>{message.text}</Text>
        ) : null}
      </View>

      {/* timestamp floats right of the bubble */}
      <Text style={styles.tsRight}>{timeLabel}</Text>
    </View>
  );
}

const TS_STYLE = {
  fontSize: 10,
  fontFamily: FontFamily.regular,
  color: Colors.textMuted,
  alignSelf: 'flex-end' as const,
  marginBottom: 4,
  lineHeight: 14,
};

const styles = StyleSheet.create({
  // ── Outgoing row ──────────────────────────────────────
  rowMe: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    marginVertical: 4,
    gap: 6,
  },
  bubbleMe: {
    maxWidth: '62%',
    backgroundColor: '#FFCABB',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myAvatarWrap: {
    alignSelf: 'flex-start',
  },
  myAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myAvatarText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: FontFamily.semiBold,
  },
  tsLeft: {
    ...TS_STYLE,
  },

  // ── Incoming row ──────────────────────────────────────
  rowThem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    marginVertical: 4,
    gap: 6,
  },
  avatarWrap: {
    alignSelf: 'flex-start',
  },
  bubbleThem: {
    maxWidth: '62%',
    backgroundColor: '#FFE8DF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tsRight: {
    ...TS_STYLE,
  },

  // ── Shared ────────────────────────────────────────────
  text: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    color: '#1A1A1A',
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
