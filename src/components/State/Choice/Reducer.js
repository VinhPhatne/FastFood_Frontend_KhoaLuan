import {
  GET_CHOICES_BY_OPTIONAL_ID,
  CREATE_CHOICE_SUCCESS,
  UPDATE_CHOICE_SUCCESS,
  DELETE_CHOICE_SUCCESS,
  GET_CHOICE_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
  choices: [],
  selectedChoice: null,
};

export const choiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHOICES_BY_OPTIONAL_ID:
      return { ...state, choices: action.payload };

    case CREATE_CHOICE_SUCCESS:
      return {
        ...state,
        choices: Array.isArray(state.choices)
          ? state.choices.concat(action.payload)
          : [action.payload],
      };

    case UPDATE_CHOICE_SUCCESS:
      return {
        ...state,
        choices: Array.isArray(state.choices)
          ? state.choices.map((item) =>
              item.id === action.payload.id ? action.payload : item
            )
          : [],
      };

    case DELETE_CHOICE_SUCCESS:
      return {
        ...state,
        choices: Array.isArray(state.choices)
          ? state.choices.filter((item) => item.id !== action.payload)
          : [],
      };

    case GET_CHOICE_BY_ID_SUCCESS:
      return { ...state, selectedChoice: action.payload };

    default:
      return state;
  }
};
