import axios from 'axios';
import { API_URL } from '../../config/api';
import { GET_CHAT_HISTORY_FAILURE, GET_CHAT_HISTORY_SUCCESS, RECEIVE_CHAT_MESSAGE, RESET_CHATBOT_STATE, SEND_MESSAGE_FAILURE, SEND_MESSAGE_SUCCESS } from './ActionType';

export const sendMessage = ({ message, sessionId }) => async (dispatch) => {
  try {
    const headers = {};
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }
    const response = await axios.post(
      `${API_URL}/v1/chatbot/message`,
      { message, sessionId },
      { headers }
    );
    if (!jwt && response.headers['x-session-id']) {
      localStorage.setItem('chatSessionId', response.headers['x-session-id']);
    }
    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAILURE,
      payload: error.response?.data?.message || 'Failed to send message',
    });
  }
};

export const getChatHistory = (sessionId) => async (dispatch) => {
  try {
    const headers = {};
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`;
    }
    const response = await axios.get(`${API_URL}/v1/chatbot/history`, {
      headers,
      params: sessionId ? { sessionId } : {},
    });
    dispatch({
      type: GET_CHAT_HISTORY_SUCCESS,
      payload: response.data.messages,
    });
  } catch (error) {
    dispatch({
      type: GET_CHAT_HISTORY_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch chat history',
    });
  }
};

export const receiveChatMessage = (message) => ({
  type: RECEIVE_CHAT_MESSAGE,
  payload: message,
});

export const resetChatbotState = () => ({
  type: RESET_CHATBOT_STATE,
});