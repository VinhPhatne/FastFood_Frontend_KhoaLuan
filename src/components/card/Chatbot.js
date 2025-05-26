import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import io from 'socket.io-client';
import { getChatHistory, receiveChatMessage, sendMessage } from '../State/ChatBox/Action';
import { API_URL } from '../config/api';
import { createChatBotMessage } from 'react-chatbot-kit';
import { IoClose } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

const socket = io(API_URL);

const config = {
  botName: 'FastFoodBot',
  initialMessages: [
    createChatBotMessage('Chào bạn! Tôi là FastFoodBot. Bạn cần giúp gì hôm nay?', {
      withAvatar: true,
      timestamp: new Date().toISOString(),
    }),
  ],
  customStyles: {
    botMessageBox: { backgroundColor: '#ff7d01' },
    chatButton: { backgroundColor: '#ff7d01' },
  },
};

// CSS tùy chỉnh cho giao diện chatbox
const chatboxStyles = `
  .react-chatbot-kit-chat-container {
    width: 400px !important; /* Tăng chiều rộng */
    height: 600px !important; /* Tăng chiều cao */
    border-radius: 12px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  .react-chatbot-kit-chat-inner-container {
    height: 100% !important;
  }

  .react-chatbot-kit-chat-header {
    background-color: #4267B2 !important; /* Màu xanh dương giống Facebook */
    color: white !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    padding: 12px 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    border-top-left-radius: 12px !important;
    border-top-right-radius: 12px !important;
  }

  .react-chatbot-kit-chat-message-container {
    background-color: #f5f6f5 !important; /* Màu nền nhạt giống Facebook */
    padding: 10px !important;
    height: calc(100% - 120px) !important; /* Điều chỉnh chiều cao để không bị tràn */
  }

  .react-chatbot-kit-chat-bot-message {
    background-color: #e4e6eb !important; /* Bong bóng chat của bot */
    color: #000 !important;
    border-radius: 18px !important;
    padding: 8px 12px !important;
    margin-left: 10px !important;
    width: 100%;
  }

  .react-chatbot-kit-chat-bot-message-arrow {
    border-right-color: #e4e6eb !important;
  }

  .react-chatbot-kit-user-chat-message {
    background-color: #4267B2 !important; /* Bong bóng chat của người dùng */
    color: white !important;
    border-radius: 18px !important;
    padding: 8px 12px !important;
    margin-right: 10px !important;
  }

  .react-chatbot-kit-user-chat-message-arrow {
    border-left-color: #4267B2 !important;
  }

  .react-chatbot-kit-chat-input-container {
    border-top: 1px solid #ddd !important;
    padding: 10px !important;
  }

  .react-chatbot-kit-chat-input {
    border-radius: 20px !important;
    padding: 8px 16px !important;
    border: 1px solid #ddd !important;
  }

  .react-chatbot-kit-chat-btn-send {
    background-color: #4267B2 !important;
    border-radius: 50% !important;
    width: 55px;
    height: 40px; 
    margin-left: 8px;
  }
`;

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.trim()) {
      actions.handleMessage(message);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { parse })
      )}
    </div>
  );
};

const ActionProvider = ({ children, actions }) => {
  return (
    <div>
      {React.Children?.map(children, (child) =>
        React.cloneElement(child, { actions })
      )}
    </div>
  );
};

const ChatbotComponent = () => {
  const dispatch = useDispatch();
  const { messages, error } = useSelector((state) => state.chatbot);
  const user = useSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState(config.initialMessages);
  const [messageKey, setMessageKey] = useState(0);
  const [sessionId, setSessionId] = useState(localStorage.getItem('chatSessionId') || uuidv4());
  const jwt = localStorage.getItem('jwt');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId && !localStorage.getItem('chatSessionId')) {
      localStorage.setItem('chatSessionId', sessionId);
    }
    dispatch(getChatHistory(userId ? undefined : sessionId));
  }, [dispatch, userId, sessionId, jwt]);

  useEffect(() => {
    const effectiveId = userId || sessionId;

    const handleConnect = () => {
      socket.emit('join', effectiveId);
      console.log('Socket joined with ID:', effectiveId);
    };

    const handleChatMessage = (message) => {
      console.log('Received chat_message:', message);
      dispatch(receiveChatMessage(message));
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
    };

    socket.on('connect', handleConnect);
    socket.on('chat_message', handleChatMessage);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('chat_message', handleChatMessage);
      socket.off('connect_error', handleConnectError);
    };
  }, [dispatch, userId, sessionId]);

  // Sync messages
  useEffect(() => {
    console.log('Redux messages updated:', messages);
    const uniqueMessagesMap = new Map();
    messages?.forEach((msg) => {
      uniqueMessagesMap.set(msg._id, msg);
    });
    let uniqueMessagesArray = Array.from(uniqueMessagesMap.values());

    uniqueMessagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const newMessages = uniqueMessagesArray.map((msg) => ({
      id: msg._id,
      message: msg.message,
      type: msg.sender === 'user' ? 'user' : 'bot',
      withAvatar: msg.sender === 'bot',
      loading: false,
      timestamp: msg.timestamp,
    }));

    setChatbotMessages((prev) => {
      const filteredPrev = prev.filter((msg) => !msg.loading);
      const uniqueMessages = newMessages.filter(
        (newMsg) => !filteredPrev.some((prevMsg) => prevMsg.id === newMsg.id)
      );
      const updatedMessages = [
        ...filteredPrev,
        ...uniqueMessages.map((msg) =>
          createChatBotMessage(msg.message, {
            id: msg.id,
            type: msg.type,
            withAvatar: msg.withAvatar,
            timestamp: msg.timestamp,
          })
        ),
      ];
      updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessageKey((prev) => prev + 1);
      return updatedMessages;
    });

    if (!userId) {
      localStorage.setItem('guestChatHistory', JSON.stringify(newMessages));
    } else {
      localStorage.removeItem('guestChatHistory');
    }
  }, [messages, userId]);

  useEffect(() => {
    if (!jwt) setChatbotMessages(config.initialMessages);
  }, [jwt]);

  useEffect(() => {
    if (!user && !userId && !jwt) {
      console.log('Resetting chatbot on logout');
      setChatbotMessages(config.initialMessages); 
      setMessageKey((prev) => prev + 1);
      localStorage.removeItem('guestChatHistory');
      localStorage.removeItem('chatSessionId');
      setSessionId(uuidv4());
      socket.emit('leave', userId || sessionId);
      console.log('Chatbot messages reset to:', config.initialMessages);
    }
  }, [user, userId, jwt, sessionId]);

  const handleMessage = async (message) => {
    const effectiveId = userId || sessionId;
    dispatch(sendMessage({ message, sessionId: userId ? undefined : sessionId }));
    const timestamp = new Date().toISOString();
    setChatbotMessages((prev) => {
      const newMessage = createChatBotMessage(message, {
        type: 'user',
        id: `temp-${Date.now()}`,
        timestamp,
      });
      const updatedMessages = [...prev, newMessage];
      updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return updatedMessages;
    });
  };

  const actions = { handleMessage };

  const messageHistory = useMemo(() => {
    return chatbotMessages;
  }, [chatbotMessages, jwt]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <style>{chatboxStyles}</style>
      {!isOpen && (
        <button
          className="bg-[#ff7d01] text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          Chat
        </button>
      )}
      {isOpen && (
        <div className="mt-2">
          <Chatbot
            key={messageKey}
            config={{
              ...config,
              customComponents: {
                header: () => (
                  <div className="react-chatbot-kit-chat-header">
                    <span>FastFoodBot</span>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gray-200 focus:outline-none"
                    >
                      <IoClose size={24} />
                    </button>
                  </div>
                ),
              },
            }}
            messageParser={MessageParser}
            actionProvider={(props) => <ActionProvider {...props} actions={actions} />}
            messageHistory={messageHistory}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;