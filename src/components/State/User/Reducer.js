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
  accounts: [],
  isLoading: false,
  error: null,
  success: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case CHANGE_PASSWORD_REQUEST:
      return { ...state, isLoading: true, error: null };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        accounts: action.payload,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        accounts: { ...state.accounts, ...action.payload },
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



// export const toggleUserState = ({ id, jwt, state }) => async (dispatch) => {
//   dispatch({ type: DELETE_USER_REQUEST });
//   try {
//     const { data } = await api.put(
//       `${API_URL}/v1/account/${state ? 'unblock' : 'delete'}/${id}`,
//       { state },
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       }
//     );
//     console.log("User state updated", data);
//     dispatch({ type: DELETE_USER_SUCCESS, payload: id });
//   } catch (error) {
//     console.log("error", error);
//     dispatch({ type: DELETE_USER_FAILURE });
//   }
// };

