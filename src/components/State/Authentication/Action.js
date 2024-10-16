import axios from "axios";
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
} from "./ActionType";
import { API_URL, api } from "../../config/api";
import { notification } from "antd";

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_URL}/v1/account/register`,
      //reqData.userData
      {
        phonenumber: reqData.phonenumber,
        password: reqData.password,
        fullname: reqData.fullname,
      }
    );
    console.log("signup user", data);

    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }
    // if (data.role === "ROLE_RESTAURANT_OWNER") {
    //   reqData.navigate("/admin/restaurants");
    // } else {
    //   reqData.navigate("/");
    // }
    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
  } catch (error) {
    console.log(error);
    dispatch({ type: REGISTER_FAILURE, payload: error.message });
  }
};

export const loginUser = (reqData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_URL}/v1/account/login`,
      //reqData.userData
      {
        phonenumber: reqData.userData.phoneNumber,
        password: reqData.userData.password,
      }
    );
    console.log("login user", data);

    if (data.accountLogin.access_token) {
      localStorage.setItem("jwt", data.accountLogin.access_token);
    }
    // if (data.role === "ROLE_RESTAURANT_OWNER") {
    //   reqData.navigate("/admin/restaurants");
    // } else {
    //   reqData.navigate("/");
    // }

    const role = data.accountLogin.account.role;

    if (role === 1) {
      reqData.navigate("/admin");
    } else if (role === 2) {
      reqData.navigate("/");
    }
    //dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    notification.success({
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.log(error);
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
  }
};

export const getUserProfile = () => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.log("No JWT found");
    return; 
  }
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await axios.get(`${API_URL}/v1/account/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("user profile", data);

    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: GET_USER_FAILURE, payload: error.message });
  }
};

// export const getUser = (jwt) => async (dispatch) => {
//   dispatch({ type: GET_USER_REQUEST });
//   try {
//     const { data } = await api.get(`/api/users/profile`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("jwt")}`,
//       },
//     });
//     console.log("user profile", data);

//     dispatch({ type: GET_USER_SUCCESS, payload: data });
//   } catch (error) {
//     console.log(error);
//     dispatch({ type: GET_USER_FAILURE, payload: error.message });
//   }
// };

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("jwt");
    console.log("logout");
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.log(error);
  }
};
