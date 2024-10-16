import axios from "axios";
import {
  CREATE_VOUCHER_REQUEST,
  CREATE_VOUCHER_SUCCESS,
  CREATE_VOUCHER_FAILURE,
  GET_VOUCHERS,
  UPDATE_VOUCHER_REQUEST,
  UPDATE_VOUCHER_SUCCESS,
  UPDATE_VOUCHER_FAILURE,
  GET_VOUCHER_BY_ID_REQUEST,
  GET_VOUCHER_BY_ID_SUCCESS,
  GET_VOUCHER_BY_ID_FAILURE,
  DELETE_VOUCHER_REQUEST,
  DELETE_VOUCHER_SUCCESS,
  DELETE_VOUCHER_FAILURE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";

// Lấy danh sách sự kiện
export const getVouchers =
  ({ jwt }) =>
  async (dispatch) => {
    try {
      const { data } = await api.get(`${API_URL}/v1/voucher/list`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("getVouchers", data);
      dispatch({ type: GET_VOUCHERS, payload: data });
    } catch (error) {
      console.error("Error fetching voucher:", error);
    }
  };

// Tạo mới sự kiện
export const createVoucher =
  ({ name, discountPercent, expDate, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_VOUCHER_REQUEST });
    try {
      const { data } = await api.post(
        `${API_URL}/v1/voucher/create`,
        { name, discountPercent, expDate },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      console.log("createvoucher", data);
      dispatch({ type: CREATE_VOUCHER_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error creating VOUCHER:", error);
      dispatch({ type: CREATE_VOUCHER_FAILURE });
    }
  };

// Cập nhật sự kiện theo id
export const updateVOUCHER =
  ({ id, name, discountPercent, expDate, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_VOUCHER_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/voucher/${id}`,
        { name, discountPercent, expDate },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      console.log("updateVOUCHER", data);
      dispatch({ type: UPDATE_VOUCHER_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error updating VOUCHER:", error);
      dispatch({ type: UPDATE_VOUCHER_FAILURE });
    }
  };

// Lấy chi tiết sự kiện theo ID
export const getVoucherById =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_VOUCHER_BY_ID_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/v1/voucher/get/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("getVOUCHERById", response.data);
      dispatch({ type: GET_VOUCHER_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching VOUCHER by ID:", error);
      dispatch({ type: GET_VOUCHER_BY_ID_FAILURE });
    }
  };

// Xóa mềm sự kiện (đặt isActive thành false)
// export const deleteEvent =
//   ({ id, jwt }) =>
//   async (dispatch) => {
//     dispatch({ type: DELETE_EVENT_REQUEST });
//     try {
//       await api.put(
//         `${API_URL}/v1/event/delete/${id}`,
//         { isActive: false },
//         { headers: { Authorization: `Bearer ${jwt}` } }
//       );
//       dispatch({ type: DELETE_EVENT_SUCCESS, payload: id });
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       dispatch({ type: DELETE_EVENT_FAILURE });
//     }
//   };