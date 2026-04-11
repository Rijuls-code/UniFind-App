import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Send, Paperclip, MapPin, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { chatsAPI, productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await chatsAPI.getAll();
      setChats(response.data);
      if (response.data.length > 0) {
        setSelectedChat(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load chats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await chatsAPI.getMessages(chatId);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      await chatsAPI.sendMessage(selectedChat.id, { text: message });
      setMessage('');
      fetchMessages(selectedChat.id);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header hideSearch />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-slate-600">Loading chats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header hideSearch />
      
      <div className="h-[calc(100vh-80px)] flex">
        {/* Chat List - Left Sidebar */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900" data-testid="chat-list-title">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No chats yet
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                  data-testid={`chat-item-${chat.id}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-600 font-bold">
                        {(chat.buyer_name || chat.seller_name || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {user?.id === chat.buyer_id ? chat.seller_name : chat.buyer_name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{chat.last_message || 'No messages yet'}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 truncate">📦 Product Chat</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window - Right Side */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-slate-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-600 font-bold text-lg">
                      {(user?.id === selectedChat.buyer_id ? selectedChat.seller_name : selectedChat.buyer_name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900" data-testid="chat-header-name">
                      {user?.id === selectedChat.buyer_id ? selectedChat.seller_name : selectedChat.buyer_name}
                    </h3>
                    <p className="text-sm text-slate-600">UniFind User</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="messages-container">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 py-12">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        data-testid={`message-${msg.id}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            isCurrentUser ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white border-t border-slate-200 px-6 py-3">
                <div className="flex gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs"
                    data-testid="quick-action-location"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Share Location
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs"
                    data-testid="quick-action-offer"
                  >
                    <IndianRupee className="h-3 w-3 mr-1" />
                    Send Offer
                  </Button>
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="rounded-xl" data-testid="attach-btn">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    data-testid="message-input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95 disabled:opacity-50"
                    data-testid="send-btn"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
