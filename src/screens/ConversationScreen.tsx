import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants';
import Typography, { FontFamily } from '../constants/typography';
import { Spacing } from '../constants/theme';
import Avatar from '../components/Common/Avatar';
import MessageBubble from '../components/ConversationScreen/MessageBubble';
import MessageInput from '../components/ConversationScreen/MessageInput';
import { useChatStore } from '../store/ChatContext';
import { RootStackParamList, Message } from '../types';

type ConvRoute = RouteProp<RootStackParamList, 'Conversation'>;

export default function ConversationScreen() {
  const navigation = useNavigation();
  const route = useRoute<ConvRoute>();
  const { conversationId, contactId } = route.params;
  const { state, sendMessage, markRead, toggleBookmark, isBookmarked } = useChatStore();
  const flatListRef = useRef<FlatList<Message>>(null);

  const contact = state.contacts.find((c) => c.id === contactId);
  const conversation = state.conversations.find((c) => c.id === conversationId);
  const messages = conversation?.messages ?? [];

  // Mark all incoming as read when screen opens
  useEffect(() => {
    markRead(conversationId);
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages.length]);

  const handleSend = (text?: string, imageUri?: string, fileName?: string) => {
    sendMessage(conversationId, text, imageUri, fileName);
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <MessageBubble message={item} contact={contact!} />
  );

  if (!contact) return null;

  return (
    // SafeAreaView only handles top; bottom is handled by KeyboardAvoidingView + input
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Avatar
            name={contact.name}
            initials={contact.initials}
            avatarColor={contact.avatarColor}
            size={36}
            ringColor={Colors.accent}
          />
          <Text style={styles.headerName} numberOfLines={1}>
            {contact.name}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            hitSlop={10}
            style={styles.actionBtn}
            onPress={() => toggleBookmark(conversationId)}
          >
            <Ionicons
              name={isBookmarked(conversationId) ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked(conversationId) ? Colors.primary : Colors.textPrimary}
            />
          </Pressable>
          <Pressable hitSlop={10} style={styles.actionBtn}>
            <Ionicons name="mic-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.actionBtn}>
            <Ionicons name="videocam-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* ── Keyboard-aware body ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Scroll to bottom when keyboard opens and layout changes
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          // Let the list shrink when keyboard is visible
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        />

        <MessageInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.sm,
  },
  headerName: {
    ...Typography.subtitle,
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Messages ─────────────────────────────────────────
  listContent: {
    paddingVertical: Spacing.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

