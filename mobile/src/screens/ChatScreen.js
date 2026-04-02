import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { users, products } from '../data/mockData';

export default function ChatScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const flatListRef = useRef(null);

  const chats = [
    {
      id: 1,
      userId: 2,
      productId: 1,
      lastMessage: 'Is the laptop still available?',
      timestamp: '10:30 AM',
      unread: 2,
      messages: [
        { id: 1, senderId: 2, text: 'Hi! Is the MacBook still available?', timestamp: '10:00 AM', isOwn: false },
        { id: 2, senderId: 1, text: 'Yes, it's available! Would you like to check it out?', timestamp: '10:15 AM', isOwn: true },
        { id: 3, senderId: 2, text: 'Is the laptop still available?', timestamp: '10:30 AM', isOwn: false },
      ],
    },
    {
      id: 2,
      userId: 3,
      productId: 2,
      lastMessage: 'Can you do ₹50k?',
      timestamp: 'Yesterday',
      unread: 0,
      messages: [
        { id: 1, senderId: 3, text: 'Interested in the iPhone. Can you do ₹50k?', timestamp: 'Yesterday', isOwn: false },
      ],
    },
  ];

  if (selectedChat) {
    const chat = chats.find(c => c.id === selectedChat);
    const user = users.find(u => u.id === chat.userId);
    const product = products.find(p => p.id === chat.productId);

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={0}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              onPress={() => setSelectedChat(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Image source={{ uri: user?.avatar }} style={styles.chatAvatar} />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>{user?.name}</Text>
              <Text style={styles.chatHeaderStatus}>Active now</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustText}>{user?.trustScore}%</Text>
            </View>
          </View>

          {/* Product Context Card */}
          <View style={styles.productContext}>
            <Image source={{ uri: product?.images[0] }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product?.title}</Text>
              <Text style={styles.productPrice}>₹{product?.price.toLocaleString()}</Text>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={chat.messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.isOwn && styles.ownMessage]}>
                <Text style={[styles.messageText, item.isOwn && styles.ownMessageText]}>
                  {item.text}
                </Text>
                <Text style={[styles.messageTime, item.isOwn && styles.ownMessageTime]}>
                  {item.timestamp}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
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
              disabled={message.length === 0}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const user = users.find(u => u.id === item.userId);
          const product = products.find(p => p.id === item.productId);
          
          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => setSelectedChat(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.chatItemLeft}>
                <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                {item.unread > 0 && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.chatItemCenter}>
                <View style={styles.chatItemHeader}>
                  <Text style={styles.chatName}>{user?.name}</Text>
                  <Text style={styles.chatTime}>{item.timestamp}</Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                <Text style={styles.chatProduct} numberOfLines={1}>
                  📦 {product?.title}
                </Text>
              </View>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
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
