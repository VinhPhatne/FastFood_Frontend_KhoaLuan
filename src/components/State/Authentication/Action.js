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
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  SET_ROLE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";
import { notification } from "antd";

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_URL}/v1/account/create`,
      //reqData.userData
      {
        phonenumber: reqData.phonenumber,
        password: reqData.password,
        fullname: reqData.fullname,
      }
    );

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

    if (data.accountLogin.access_token) {
      localStorage.setItem("jwt", data.accountLogin.access_token);
    }

    // if (data.role === "ROLE_RESTAURANT_OWNER") {
    //   reqData.navigate("/admin/restaurants");
    // } else {
    //   reqData.navigate("/");
    // }

    const role = data.accountLogin.account.role;
    // Lưu role vào localStorage
    localStorage.setItem("role", role);
    if (role === 1) {
      reqData.navigate("/admin");
    } else if (role === 2) {
      reqData.navigate("/manager");
    } else {
      reqData.navigate("/");
    }
    //dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    notification.success({
      message: "Đăng nhập thành công",
    });
    return { type: LOGIN_SUCCESS, payload: data };
  } catch (error) {
    const message = error.response?.data?.message || "Đăng nhập thất bại";
    dispatch({ type: LOGIN_FAILURE, payload: message });
    notification.error({
      message,
    });
    return { type: LOGIN_FAILURE, payload: message };
  }
};

export const getUserProfile = () => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return;
  }
  dispatch({ type: GET_USER_REQUEST });
  try {
    const { data } = await axios.get(`${API_URL}/v1/account/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: GET_USER_SUCCESS, payload: data });
    return data;
  } catch (error) {
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
    localStorage.removeItem("role");
    dispatch({ type: LOGOUT });
  } catch (error) {}
};

export const sendOtp = (reqData) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/v1/account/send-otp`, {
      phonenumber: reqData.phonenumber,
      email: reqData.email,
      password: reqData.password,
      fullname: reqData.fullname,
    });

    dispatch({ type: SEND_OTP_SUCCESS, payload: data });
    notification.success({
      message: "OTP đã được gửi thành công!",
    });
  } catch (error) {
    dispatch({ type: SEND_OTP_FAILURE, payload: error.message });
    notification.error({
      message: "Gửi OTP thất bại!",
      description: error.message,
    });
  }
};

export const verifyOtp = (reqData) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/v1/account/verify-otp`, {
      phonenumber: reqData.phonenumber,
      email: reqData.email,
      password: reqData.password,
      fullname: reqData.fullname,
      otp: reqData.otp,
    });
    console.log("OTP verified", data);

    dispatch({ type: VERIFY_OTP_SUCCESS, payload: data.jwt });
    localStorage.setItem("jwt", data.jwt);
    notification.success({
      message: "Xác thực OTP thành công!",
    });
    reqData.navigate("/"); // Điều hướng sau khi xác thực thành công
  } catch (error) {
    console.log(error);
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
    notification.error({
      message: "Xác thực OTP thất bại!",
      description: error.message,
    });
  }
};

export const setUserRole = (role) => ({
  type: SET_ROLE,
  payload: role,
});
