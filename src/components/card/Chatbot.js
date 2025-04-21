import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import io from 'socket.io-client';
import { getChatHistory, receiveChatMessage, sendMessage } from '../State/ChatBox/Action';
import { API_URL } from '../config/api';
import { createChatBotMessage } from 'react-chatbot-kit';

// Thêm icon X từ react-icons
import { IoClose } from 'react-icons/io5';

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
  const [messageKey, setMessageKey] = useState(0); // Key để buộc render lại

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    dispatch(getChatHistory());
  }, [dispatch]);

  useEffect(() => {
    if (!userId) {
      console.log('User not logged in yet');
      return;
    }

    const handleConnect = () => {
      socket.emit('join', userId);
      console.log('Socket joined with user ID:', userId);
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
  }, [dispatch, userId]);

  // Đồng bộ Redux messages với react-chatbot-kit
  useEffect(() => {
    console.log('Redux messages updated:', messages);
    // Loại bỏ tin nhắn trùng lặp từ messages dựa trên _id
    const uniqueMessagesMap = new Map();
    messages?.forEach((msg) => {
      uniqueMessagesMap.set(msg._id, msg);
    });
    let uniqueMessagesArray = Array.from(uniqueMessagesMap.values());

    // Sắp xếp tin nhắn theo timestamp
    uniqueMessagesArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Chuyển đổi messages thành định dạng react-chatbot-kit
    const newMessages = uniqueMessagesArray.map((msg) => ({
      id: msg._id,
      message: msg.message,
      type: msg.sender === 'user' ? 'user' : 'bot',
      withAvatar: msg.sender === 'bot',
      loading: false,
      timestamp: msg.timestamp,
    }));

    setChatbotMessages((prev) => {
      // Loại bỏ tin nhắn "Đang xử lý..."
      const filteredPrev = prev.filter((msg) => !msg.loading);
      // Loại bỏ tin nhắn trùng lặp dựa trên id
      const uniqueMessages = newMessages.filter(
        (newMsg) => !filteredPrev.some((prevMsg) => prevMsg.id === newMsg.id)
      );
      // Thêm các tin nhắn mới
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
      // Sắp xếp lại toàn bộ danh sách theo timestamp
      updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      console.log('Updated chatbotMessages:', updatedMessages);
      // Buộc render lại bằng cách thay đổi key
      setMessageKey((prev) => prev + 1);
      return updatedMessages;
    });
  }, [messages]);

  const handleMessage = async (message) => {
    // Gửi tin nhắn qua Redux
    dispatch(sendMessage(message));
    // Thêm tin nhắn người dùng trực tiếp vào chatbotMessages
    const timestamp = new Date().toISOString();
    setChatbotMessages((prev) => {
      const newMessage = createChatBotMessage(message, {
        type: 'user',
        id: `temp-${Date.now()}`,
        timestamp,
      });
      const updatedMessages = [...prev, newMessage];
      // Sắp xếp lại theo timestamp
      updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return updatedMessages;
    });
  };

  const actions = { handleMessage };

  // Sử dụng useMemo để đảm bảo tham chiếu của messageHistory thay đổi
  const messageHistory = useMemo(() => chatbotMessages, [chatbotMessages]);

  if (!userId) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="bg-[#ff7d01] text-white p-3 rounded-full shadow-lg"
          onClick={() => alert('Vui lòng đăng nhập để sử dụng chatbot')}
        >
          Chat
        </button>
      </div>
    );
  }

  if (error) {
    console.error('Chatbot error:', error);
    return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <style>{chatboxStyles}</style>
      {!isOpen && <button
        className="bg-[#ff7d01] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        Chat
      </button>}
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