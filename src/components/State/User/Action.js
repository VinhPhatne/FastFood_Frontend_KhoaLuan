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
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_BY_ID_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
} from "./ActionType";
import { api, API_URL } from "../../config/api";
import { notification } from "antd";

export const getUsers =
  ({ page = 1, search, state, role }) =>
  async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/v1/account/list`, {
        params: {
          page: page,
          search: search,
          state: state,
          role: role,
        },
      });
      dispatch({
        type: GET_USER_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: GET_USER_FAILURE,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

export const createUser = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  try {
    const { data } = await axios.post(`${API_URL}/v1/account/create`, {
      fullname: reqData.fullname,
      phonenumber: reqData.phonenumber,
      password: reqData.password,
      email: reqData.email,
      role: reqData.role,
      address: reqData.address,
    });
    dispatch({ type: CREATE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
    throw error;
  }
};

// export const getUsersListPage =
//   ({ jwt, page = 1, search, state, role }) =>
//   async (dispatch) => {
//     try {
//       const response = await axios.get(`${API_URL}/v1/account/listpage`, {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//         params: {
//           page: page,
//           search: search,
//           state: state,
//           role: role,
//         },
//       });

//       dispatch({
//         type: GET_USER_SUCCESS,
//         payload: response.data.data,
//       });
//     } catch (error) {
//       dispatch({
//         type: GET_USER_FAILURE,
//         payload: error.response?.data?.message || "Failed to fetch products",
//       });
//     }
//   };

export const getUserById =
  ({ id, jwt }) =>
  async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/v1/account/get/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({
        type: GET_USER_BY_ID_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      dispatch({ type: GET_USER_BY_ID_FAILURE, payload: error });
      return null;
    }
  };

// Action để cập nhật thông tin người dùng
export const updateUserProfile = (id, reqData) => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return;
  }

  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await axios.put(
      `${API_URL}/v1/account/${id}`,
      {
        fullname: reqData.userData.fullname,
        phonenumber: reqData.userData.phonenumber,
        address: reqData.userData.address,
        //email: reqData.userData.email,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
    throw error;
  }
};

export const updateUser = (id, reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await axios.put(`${API_URL}/v1/account/${id}`, {
      fullname: reqData.fullname,
      phonenumber: reqData.phonenumber,
      email: reqData.email,
    });
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
    throw error;
  }
};

export const deleteUser =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/account/delete/${id}`,
        { state: false },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: DELETE_USER_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: DELETE_USER_FAILURE });
    }
  };

export const unBlockUser =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/account/unblock/${id}`,
        { state: true },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: DELETE_USER_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: DELETE_USER_FAILURE });
    }
  };

export const changePassword = (id, reqData) => async (dispatch) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
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
    notification.success({
      message: "Thành công",
      description: "Mật khẩu đã được thay đổi thành công!",
    });
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    console.log(error);

    const errorMessage = error.response?.data?.message || "Có lỗi xảy ra !!!";
    notification.error({
      description: errorMessage,
    });
    dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error.message });
  }
};
