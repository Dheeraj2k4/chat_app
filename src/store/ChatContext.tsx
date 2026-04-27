import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChatState, ChatAction, Message, Conversation } from '../types';
import { CONTACTS, INITIAL_CONVERSATIONS, CURRENT_USER_ID } from '../data/mockData';

const STORAGE_KEY = '@chat_conversations_v1';

// ─── Reducer ─────────────────────────────────────────────────────────────────

const REPLIES: Record<string, string[]> = {
  c1: ["That's great to hear!", 'Sure, let me check on that.', 'Sounds good 👍', 'Will do!'],
  c2: ['Awesome!', "That's so cool 😊", 'Thanks for letting me know', 'Got it!'],
  c3: ["Yes, let's go!", 'Absolutely!', "I'm in 💪", 'Makes sense to me.'],
  c4: ['Sure thing!', 'Ok!', "Let me know when you're free", 'Works for me'],
  c5: ['Go ahead, ask away!', "Of course!", "I'm all ears", 'Yes, what is it?'],
  c6: ['Yesss!!!', 'Totally!', "Can't wait 🎉", 'Love it!'],
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'SEND_MESSAGE': {
      const { conversationId, message } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, { ...message, conversationId }] }
            : conv
        ),
      };
    }

    case 'MARK_READ': {
      const { conversationId } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.senderId !== CURRENT_USER_ID ? { ...m, read: true } : m
                ),
              }
            : conv
        ),
      };
    }

    case 'SIMULATE_REPLY': {
      const { conversationId, contactId } = action.payload;
      const pool = REPLIES[contactId] ?? ["Ok!", "Got it!", "Sure!"];
      const text = pool[Math.floor(Math.random() * pool.length)];
      const reply: Message = {
        id: `msg_${Date.now()}_reply`,
        conversationId,
        senderId: contactId,
        text,
        timestamp: Date.now(),
        read: false,
      };
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, reply] }
            : conv
        ),
      };
    }

    case 'TOGGLE_BOOKMARK': {
      const { conversationId } = action.payload;
      const ids = state.bookmarkedConversationIds;
      const already = ids.includes(conversationId);
      return {
        ...state,
        bookmarkedConversationIds: already
          ? ids.filter((id) => id !== conversationId)
          : [...ids, conversationId],
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (
    conversationId: string,
    text?: string,
    imageUri?: string,
    fileName?: string
  ) => void;
  markRead: (conversationId: string) => void;
  toggleBookmark: (conversationId: string) => void;
  isBookmarked: (conversationId: string) => boolean;
  getConversationByContact: (contactId: string) => Conversation | undefined;
  getOrCreateConversation: (contactId: string) => Conversation;
}

const ChatContext = createContext<ChatContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, {
    contacts: CONTACTS,
    conversations: INITIAL_CONVERSATIONS,
    bookmarkedConversationIds: [],
  });

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<ChatState>;
          if (saved.conversations) {
            dispatch({
              type: 'LOAD_STATE',
              payload: {
                contacts: CONTACTS,
                conversations: saved.conversations,
                bookmarkedConversationIds: saved.bookmarkedConversationIds ?? [],
              },
            });
          }
        }
      } catch (_) {
        // ignore parse errors — use initial state
      }
    })();
  }, []);

  // Persist conversations + bookmarks whenever they change
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        conversations: state.conversations,
        bookmarkedConversationIds: state.bookmarkedConversationIds,
      })
    ).catch(() => {});
  }, [state.conversations, state.bookmarkedConversationIds]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (
      conversationId: string,
      text?: string,
      imageUri?: string,
      fileName?: string
    ) => {
      const message: Omit<Message, 'conversationId'> = {
        id: `msg_${Date.now()}`,
        senderId: CURRENT_USER_ID,
        text,
        imageUri,
        fileName,
        timestamp: Date.now(),
        read: true,
      };
      dispatch({ type: 'SEND_MESSAGE', payload: { conversationId, message } });

      // Simulate reply after 1.5–3s
      const contactId = state.conversations.find(
        (c) => c.id === conversationId
      )?.contactId;
      if (contactId) {
        const delay = 1500 + Math.random() * 1500;
        setTimeout(() => {
          dispatch({ type: 'SIMULATE_REPLY', payload: { conversationId, contactId } });
        }, delay);
      }
    },
    [state.conversations]
  );

  const markRead = useCallback((conversationId: string) => {
    dispatch({ type: 'MARK_READ', payload: { conversationId } });
  }, []);

  const toggleBookmark = useCallback((conversationId: string) => {
    dispatch({ type: 'TOGGLE_BOOKMARK', payload: { conversationId } });
  }, []);

  const isBookmarked = useCallback(
    (conversationId: string) =>
      state.bookmarkedConversationIds.includes(conversationId),
    [state.bookmarkedConversationIds]
  );

  const getConversationByContact = useCallback(
    (contactId: string) =>
      state.conversations.find((c) => c.contactId === contactId),
    [state.conversations]
  );

  const getOrCreateConversation = useCallback(
    (contactId: string): Conversation => {
      const existing = state.conversations.find((c) => c.contactId === contactId);
      if (existing) return existing;

      const newConv: Conversation = {
        id: `conv_${contactId}_${Date.now()}`,
        contactId,
        messages: [],
      };
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          contacts: state.contacts,
          conversations: [...state.conversations, newConv],
          bookmarkedConversationIds: state.bookmarkedConversationIds,
        },
      });
      return newConv;
    },
    [state]
  );

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
        sendMessage,
        markRead,
        toggleBookmark,
        isBookmarked,
        getConversationByContact,
        getOrCreateConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useChatStore(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatStore must be used inside ChatProvider');
  return ctx;
}
