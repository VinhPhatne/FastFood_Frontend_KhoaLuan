import {
  GET_EVENTS,
  CREATE_EVENT_SUCCESS,
  UPDATE_EVENT_SUCCESS,
  DELETE_EVENT_SUCCESS,
  GET_EVENT_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
  events: [],
  selectedEvent: null,
};

export const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return { ...state, events: action.payload };

    case CREATE_EVENT_SUCCESS:
      return {
        ...state,
        events: Array.isArray(state.events)
          ? state.events.concat(action.payload)
          : [action.payload],
      };
    case UPDATE_EVENT_SUCCESS:
      return {
        ...state,
        events: Array.isArray(state.events)
          ? state.events.concat(action.payload)
          : [action.payload], 
      };

    case DELETE_EVENT_SUCCESS:
      return {
        ...state,
        events: Array.isArray(state.events)
          ? state.events.filter((item) => item.id !== action.payload)
          : [], 
      };

    case GET_EVENT_BY_ID_SUCCESS:
      return { ...state, selectedEvent: action.payload };

    default:
      return state;
  }
};
