import {
  GET_OPTIONALS,
  CREATE_OPTIONAL_SUCCESS,
  UPDATE_OPTIONAL_SUCCESS,
  DELETE_OPTIONAL_SUCCESS,
  GET_OPTIONAL_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
  optionals: [],
  selectedOptional: null,
};

export const optionalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OPTIONALS:
      return { ...state, optionals: action.payload };

    case CREATE_OPTIONAL_SUCCESS:
      return {
        ...state,
        optionals: Array.isArray(state.optionals)
          ? state.optionals.concat(action.payload)
          : [action.payload],
      };

    case UPDATE_OPTIONAL_SUCCESS:
      return {
        ...state,
        optionals: Array.isArray(state.optionals)
          ? state.optionals.map((item) =>
              item.id === action.payload.id ? action.payload : item
            )
          : [],
      };

    case DELETE_OPTIONAL_SUCCESS:
      return {
        ...state,
        optionals: Array.isArray(state.optionals)
          ? state.optionals.filter((item) => item.id !== action.payload)
          : [],
      };

    case GET_OPTIONAL_BY_ID_SUCCESS:
      return { ...state, selectedOptional: action.payload };

    default:
      return state;
  }
};
