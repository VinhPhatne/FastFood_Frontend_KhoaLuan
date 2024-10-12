import axios from "axios";
import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
} from "./ActionType";
import { API_URL } from "../../config/api";

// Action để lấy thông tin người dùng

// export const getUserProfile = () => async (dispatch) => {
//   const jwt = localStorage.getItem("jwt");
//   if (!jwt) {
//     console.log("No JWT found");
//     return;
//   }

//   dispatch({ type: GET_USER_REQUEST });
//   try {
//     const { data } = await axios.get(`${API_URL}/v1/account/profile`, {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//       },
//     });
//     console.log("user profile", data);
//     dispatch({ type: GET_USER_SUCCESS, payload: data });
//   } catch (error) {
//     console.log(error);
//     dispatch({ type: GET_USER_FAILURE, payload: error.message });
//   }
// };

// Action để cập nhật thông tin người dùng
export const updateUserProfile = (id, reqData) => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.log("No JWT found");
    return;
  }

  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_URL}/v1/account/${id}`,
      {
        fullname: reqData.userData.fullname,
        phonenumber: reqData.userData.phonenumber,
        //email: reqData.userData.email,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("Updated user profile", data);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
  }
};

export const changePassword = (id, reqData) => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.log("No JWT found");
    return;
  }

  dispatch({ type: CHANGE_PASSWORD_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_URL}/v1/account/profile/change-password`,
      {
        id: id,
        currentPassword: reqData.userData.currentPassword,
        newPassword: reqData.userData.newPassword,
        confirmPassword: reqData.userData.confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("Password changed", data);
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error.message });
  }
};
