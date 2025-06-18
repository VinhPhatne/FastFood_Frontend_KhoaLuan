import axios from "axios";
import {
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  CREATE_EVENT_FAILURE,
  GET_EVENTS,
  UPDATE_EVENT_REQUEST,
  UPDATE_EVENT_SUCCESS,
  UPDATE_EVENT_FAILURE,
  GET_EVENT_BY_ID_REQUEST,
  GET_EVENT_BY_ID_SUCCESS,
  GET_EVENT_BY_ID_FAILURE,
  DELETE_EVENT_REQUEST,
  DELETE_EVENT_SUCCESS,
  DELETE_EVENT_FAILURE,
  BLOCK_EVENT_REQUEST,
  BLOCK_EVENT_SUCCESS,
  BLOCK_EVENT_FAILURE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";

// Lấy danh sách sự kiện
export const getEvents =
  ({ jwt }) =>
  async (dispatch) => {
    try {
      const { data } = await api.get(`${API_URL}/v1/event/list`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_EVENTS, payload: data });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

// Tạo mới sự kiện
export const createEvent =
  ({ name, discountPercent, expDate, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_EVENT_REQUEST });
    try {
      const { data } = await api.post(
        `${API_URL}/v1/event/create`,
        { name, discountPercent, expDate },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: CREATE_EVENT_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      dispatch({ type: CREATE_EVENT_FAILURE });
      throw error;
    }
  };

// Cập nhật sự kiện theo id
export const updateEvent =
  ({ id, name, discountPercent, expDate, jwt, products }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_EVENT_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/event/${id}`,
        { name, discountPercent, expDate, products },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: UPDATE_EVENT_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error updating event:", error);
      dispatch({ type: UPDATE_EVENT_FAILURE });
      throw error;
    }
  };

// Lấy chi tiết sự kiện theo ID
export const getEventById =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_EVENT_BY_ID_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/v1/event/get/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_EVENT_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      dispatch({ type: GET_EVENT_BY_ID_FAILURE });
    }
  };

// Xóa mềm sự kiện (đặt isActive thành false)
export const blockEvent =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: BLOCK_EVENT_REQUEST });
    try {
      await api.put(
        `${API_URL}/v1/event/${id}`,
        { isActive: false },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: BLOCK_EVENT_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting event:", error);
      dispatch({ type: BLOCK_EVENT_FAILURE });
    }
  };

  export const unblockEvent =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: BLOCK_EVENT_REQUEST });
    try {
      await api.put(
        `${API_URL}/v1/event/${id}`,
        { isActive: true },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: BLOCK_EVENT_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting event:", error);
      dispatch({ type: BLOCK_EVENT_FAILURE });
    }
  };

export const deleteEvent =
  ({ id }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_EVENT_REQUEST });
    try {
      await api.delete(`${API_URL}/v1/event/harddelete/${id}`);
      dispatch({ type: DELETE_EVENT_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting product:", error);
      dispatch({ type: DELETE_EVENT_FAILURE });
    }
  };
