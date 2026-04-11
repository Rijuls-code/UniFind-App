import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { chatsAPI } from '../services/api';
import { firebaseAuth } from '../services/firebase';

export default function ChatScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat.id);
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      const uid = await firebaseAuth.getUserId();
      setCurrentUserId(uid);
      const data = await chatsAPI.getAll();
      setChats(data);
    } catch (e) {
      console.error('Failed to load chats:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const data = await chatsAPI.getMessages(chatId);
      setMessages(data);
    } catch (e) {
      console.error('Failed to load messages:', e);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;
    try {
      await chatsAPI.sendMessage(selectedChat.id, { text: message });
      setMessage('');
      fetchMessages(selectedChat.id);
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={0}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.chatAvatarPlaceholder}>
              <Ionicons name="person" size={20} color="#94A3B8" />
            </View>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>
                {currentUserId === selectedChat.buyer_id ? selectedChat.seller_name : selectedChat.buyer_name}
              </Text>
              <Text style={styles.chatHeaderStatus}>UniFind User</Text>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isOwn = item.sender_id === currentUserId;
              return (
                <View style={[styles.messageBubble, isOwn && styles.ownMessage]}>
                  <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>{item.text}</Text>
                  <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              );
            }}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>No messages yet. Say hi!</Text>
            }
          />

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="location" size={18} color="#2563EB" />
              <Text style={styles.quickActionText}>Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="cash" size={18} color="#10B981" />
              <Text style={styles.quickActionText}>Make Offer</Text>
            </TouchableOpacity>
          </View>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle" size={28} color="#2563EB" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, message.length > 0 && styles.sendButtonActive]}
              onPress={handleSend}
              disabled={message.length === 0}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => setSelectedChat(item)}
            activeOpacity={0.7}
          >
            <View style={styles.chatItemLeft}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color="#94A3B8" />
              </View>
            </View>
            <View style={styles.chatItemCenter}>
              <View style={styles.chatItemHeader}>
                <Text style={styles.chatName}>
                  {currentUserId === item.buyer_id ? item.seller_name : item.buyer_name}
                </Text>
                <Text style={styles.chatTime}>
                  {item.last_message_at ? new Date(item.last_message_at).toLocaleDateString() : ''}
                </Text>
              </View>
              <Text style={styles.chatMessage} numberOfLines={1}>
                {item.last_message || 'No messages yet'}
              </Text>
              <Text style={styles.chatProduct}>📦 Product Chat</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={[styles.chatList, chats.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
            <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
            <Text style={{ fontSize: 16, color: '#94A3B8', marginTop: 16 }}>No chats yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  chatList: {
    padding: 0,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chatItemLeft: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatItemCenter: {
    flex: 1,
    marginLeft: 12,
  },
  chatItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  chatTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  chatMessage: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  chatProduct: {
    fontSize: 12,
    color: '#94A3B8',
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  chatAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  trustBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  productContext: {
    flexDirection: 'row',
    padding: 12,
    margin: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '75%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ownMessage: {
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    borderWidth: 0,
  },
  messageText: {
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 11,
    color: '#94A3B8',
    alignSelf: 'flex-end',
  },
  ownMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        paddingBottom: 28,
      },
    }),
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 15,
    color: '#0F172A',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#2563EB',
  },
});
