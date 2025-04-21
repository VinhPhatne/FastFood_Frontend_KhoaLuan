import axios from 'axios';
import { API_URL } from '../../config/api';
import { GET_CHAT_HISTORY_FAILURE, GET_CHAT_HISTORY_SUCCESS, RECEIVE_CHAT_MESSAGE, SEND_MESSAGE_FAILURE, SEND_MESSAGE_SUCCESS } from './ActionType';

export const sendMessage = (message) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/v1/chatbot/message`, { message }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    });
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

export const getChatHistory = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/chatbot/history`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
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