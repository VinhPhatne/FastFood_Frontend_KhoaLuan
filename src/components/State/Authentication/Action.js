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
import { resetChatbotState } from '../ChatBox/Action';

export const registerUser = (reqData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_URL}/v1/account/create`,
      {
        phonenumber: reqData.phonenumber,
        password: reqData.password,
        fullname: reqData.fullname,
      }
    );

    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }
    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
  } catch (error) {
    console.log(error);
    dispatch({ type: REGISTER_FAILURE, payload: error.message });
  }
};

export const loginUser = ({ userData, navigate, setIs2FAVisible, setQrCodeUrl, setUserId }) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_URL}/v1/account/login`,
      {
        phonenumber: userData.phoneNumber,
        password: userData.password,
      }
    );

    const role = data.accountLogin.account.role;
    const userId = data.accountLogin.account._id;

    if ([1, 2].includes(role)) {
      setIs2FAVisible(true);
      setUserId(userId);
      localStorage.setItem("role_temp", role);
      localStorage.setItem('userId_temp', userId);
      localStorage.setItem('jwt_temp', data.accountLogin.access_token);
      if (data.accountLogin.account.showQrCode) {
        try {
          const qrResponse = await axios.get(`${API_URL}/v1/account/${userId}/get_2FA_QRcode`, {
            headers: { Authorization: `Bearer ${data.accountLogin.access_token}` }
          });
          setQrCodeUrl(qrResponse.data.qrcode);
        } catch (error) {
          const message = error.response?.data?.message || "Không thể lấy mã QR 2FA";
          notification.error({ message });
          return { type: LOGIN_FAILURE, payload: message };
        }
      }
    } else {
      if (data.accountLogin.access_token) {
        localStorage.setItem("jwt", data.accountLogin.access_token);
      }
      localStorage.setItem("role", role);
      localStorage.setItem('userId', userId);
      const sessionId = localStorage.getItem('chatSessionId');
      if (sessionId) {
        await axios.post(
          `${API_URL}/v1/chatbot/sync-guest-messages`,
          { sessionId },
          { headers: { Authorization: `Bearer ${data.accountLogin.access_token}` } }
        );
        localStorage.removeItem('chatSessionId');
        localStorage.removeItem('guestChatHistory');
      }

      
      navigate("/");
      notification.success({
        message: "Đăng nhập thành công",
      });
    }

    dispatch({ type: LOGIN_SUCCESS, payload: data });
    return { type: LOGIN_SUCCESS, payload: data };
  } catch (error) {
    const message = error.response?.data?.message || "Đăng nhập thất bại";
    dispatch({ type: LOGIN_FAILURE, payload: message });
    notification.error({ message });
    return { type: LOGIN_FAILURE, payload: message };
  }
};

export const verify2FA = ({ userId, otp, navigate }) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/v1/account/${userId}/verify_2fa`,
      { otpToken: String(otp) },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    const role = localStorage.getItem('role_temp');
    localStorage.setItem("role", role);
    const userIdLocal = localStorage.getItem('userId_temp');
    const jwt = localStorage.getItem('jwt_temp');
    localStorage.setItem("userId", userIdLocal);
    localStorage.setItem("jwt", jwt);
    dispatch(setUserRole(role));

    console.log('1')
    if (role === "1") {
      navigate("/admin");
    } else if (role === "2") {
      navigate("/manager");
    } else {
      navigate("/");
    }

    localStorage.removeItem('role_temp');
    localStorage.removeItem('userId_temp');
    localStorage.removeItem('jwt_temp');

    notification.success({
      message: "Xác thực 2FA thành công",
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Xác thực 2FA thất bại";
    notification.error({ message });
    throw error;
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

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem('userId');
    localStorage.removeItem('guestChatHistory');
    localStorage.removeItem('chatSessionId');
    dispatch({ type: LOGOUT });
    dispatch(resetChatbotState());
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
