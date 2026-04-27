import { Contact, Conversation, Message } from '../types';

export const CURRENT_USER_ID = 'me';

export const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Larry Lin',
    initials: 'LL',
    avatarColor: '#4A90D9',
    isOnline: true,
  },
  {
    id: 'c2',
    name: 'Lori Bryson',
    initials: 'LB',
    avatarColor: '#E67E22',
    isOnline: false,
  },
  {
    id: 'c3',
    name: 'Marcus Reed',
    initials: 'MR',
    avatarColor: '#9B59B6',
    isOnline: true,
  },
  {
    id: 'c4',
    name: 'Kelly Williams',
    initials: 'KW',
    avatarColor: '#E74C3C',
    isOnline: false,
  },
  {
    id: 'c5',
    name: 'Phoenix Baker',
    initials: 'PB',
    avatarColor: '#1ABC9C',
    isOnline: true,
  },
  {
    id: 'c6',
    name: 'Edith Koenig',
    initials: 'EK',
    avatarColor: '#F39C12',
    isOnline: false,
  },
];

const now = Date.now();
const mins = (n: number) => now - n * 60 * 1000;
const days = (n: number) => now - n * 24 * 60 * 60 * 1000;

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_c1',
    contactId: 'c1',
    messages: [
      { id: 'm1', conversationId: 'conv_c1', senderId: 'c1',              text: 'What do you think about my last work? Can tell something',                                       timestamp: days(1) + 16 * 60 * 1000, read: true },
      { id: 'm2', conversationId: 'conv_c1', senderId: CURRENT_USER_ID,  text: "Sure, actually you did great job, I would suggest only to change the font size it's to big.", timestamp: days(1) + 18 * 60 * 1000, read: true,  status: 'read' },
      { id: 'm3', conversationId: 'conv_c1', senderId: 'c1',              text: 'Okey thanks for your advise and kind words, i got to go now, bye',                              timestamp: days(1) + 20 * 60 * 1000, read: true },
      { id: 'm4', conversationId: 'conv_c1', senderId: CURRENT_USER_ID,  text: 'See u man!',                                                                                    timestamp: days(1) + 24 * 60 * 1000, read: true,  status: 'read' },
      { id: 'm5', conversationId: 'conv_c1', senderId: CURRENT_USER_ID,  text: 'Hi man, I have a question for u',                                                               timestamp: mins(120),                 read: true,  status: 'delivered' },
      { id: 'm6', conversationId: 'conv_c1', senderId: 'c1',              text: "hi what's up?",                                                                                 timestamp: mins(5),                   read: false },
    ],
  },
  {
    id: 'conv_c2',
    contactId: 'c2',
    messages: [
      { id: 'm7', conversationId: 'conv_c2', senderId: CURRENT_USER_ID, text: 'Hey Lori! How was the presentation?', timestamp: mins(40), read: true,  status: 'read' },
      { id: 'm8', conversationId: 'conv_c2', senderId: 'c2',             text: "That's awesome",                    timestamp: mins(30), read: false },
    ],
  },
  {
    id: 'conv_c3',
    contactId: 'c3',
    messages: [
      { id: 'm9',  conversationId: 'conv_c3', senderId: 'c3',             text: 'Are we still on for the meeting?', timestamp: mins(60), read: true },
      { id: 'm10', conversationId: 'conv_c3', senderId: CURRENT_USER_ID, text: 'Yes, man, we can do it...',         timestamp: mins(50), read: true, status: 'read' },
    ],
  },
  {
    id: 'conv_c4',
    contactId: 'c4',
    messages: [
      { id: 'm11', conversationId: 'conv_c4', senderId: 'c4', text: 'Do you have a time?', timestamp: mins(90), read: false },
    ],
  },
  {
    id: 'conv_c5',
    contactId: 'c5',
    messages: [
      { id: 'm12', conversationId: 'conv_c5', senderId: 'c5', text: 'I have question for u', timestamp: mins(100), read: false },
    ],
  },
  {
    id: 'conv_c6',
    contactId: 'c6',
    messages: [
      { id: 'm13', conversationId: 'conv_c6', senderId: 'c6', text: 'Yes!!!', timestamp: mins(110), read: false },
    ],
  },
];
