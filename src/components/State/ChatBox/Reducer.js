import { GET_CHAT_HISTORY_FAILURE, GET_CHAT_HISTORY_SUCCESS, RECEIVE_CHAT_MESSAGE, SEND_MESSAGE_FAILURE, SEND_MESSAGE_SUCCESS } from './ActionType';


const initialState = {
  messages: [],
  error: null,
};

const chatbotReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload.userMessage, action.payload.botMessage],
        error: null,
      };
    case SEND_MESSAGE_FAILURE:
      return { ...state, error: action.payload };
    case GET_CHAT_HISTORY_SUCCESS:
      return { ...state, messages: action.payload, error: null };
    case GET_CHAT_HISTORY_FAILURE:
      return { ...state, error: action.payload };
    case RECEIVE_CHAT_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload.userMessage, action.payload.botMessage],
      };
    default:
      return state;
  }
};

export default chatbotReducer;