export interface Contact {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  phone?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // 'me' | contact.id
  text?: string;
  imageUri?: string;
  fileName?: string;
  timestamp: number; // unix ms
  read: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  messages: Message[];
}

export interface ChatState {
  contacts: Contact[];
  conversations: Conversation[];
}

export type ChatAction =
  | { type: 'LOAD_STATE'; payload: ChatState }
  | {
      type: 'SEND_MESSAGE';
      payload: {
        conversationId: string;
        message: Omit<Message, 'conversationId'>;
      };
    }
  | { type: 'MARK_READ'; payload: { conversationId: string } }
  | {
      type: 'SIMULATE_REPLY';
      payload: { conversationId: string; contactId: string };
    };

export type RootStackParamList = {
  MainTabs: undefined;
  Conversation: { conversationId: string; contactId: string };
};

export type MainTabParamList = {
  ChatList: undefined;
  Contacts: undefined;
  Bookmarks: undefined;
};
