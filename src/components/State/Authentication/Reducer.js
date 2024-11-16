import {
  ADD_TO_FAVORITE_FAILURE,
  ADD_TO_FAVORITE_REQUEST,
  ADD_TO_FAVORITE_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  SET_ROLE,
} from "./ActionType";
//import { isPresentInFavorites } from "../../config/logic";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  jwt: null,
  favorites: [],
  success: null,
  role: '',
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
      return { ...state, isLoading: true, error: null, success: null };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case VERIFY_OTP_SUCCESS:
      //localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        isLoading: false,
        jwt: action.payload,
        success: "Action success",
      };

    case SEND_OTP_SUCCESS:
      return { ...state, isLoading: false, success: "OTP sent successfully" };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        favorites: action.payload.favorites,
      };

    // case LOGOUT:
    //   return initialState;

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case ADD_TO_FAVORITE_FAILURE:
    case SEND_OTP_FAILURE:
    case VERIFY_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        success: null,
      };

    case SET_ROLE:
      localStorage.setItem("role", action.payload);
      return { ...state, role: action.payload };

    default:
      return state;
  }
};
