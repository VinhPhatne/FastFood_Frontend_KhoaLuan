import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_REQUEST,
} from "./ActionType";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  success: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case CHANGE_PASSWORD_REQUEST:
      return { ...state, isLoading: true, error: null };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: { ...state.user, ...action.payload },
        success: "Update success",
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: "Password changed successfully",
      };

    case GET_USER_FAILURE:
    case UPDATE_USER_FAILURE:
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
