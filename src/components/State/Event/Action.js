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
      console.log("getEvents", data);
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
      console.log("createEvent", data);
      dispatch({ type: CREATE_EVENT_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error creating event:", error);
      dispatch({ type: CREATE_EVENT_FAILURE });
    }
  };

// Cập nhật sự kiện theo id
export const updateEvent =
  ({ id, name, discountPercent, expDate, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_EVENT_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/event/${id}`,
        { name, discountPercent, expDate },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      console.log("updateEvent", data);
      dispatch({ type: UPDATE_EVENT_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error updating event:", error);
      dispatch({ type: UPDATE_EVENT_FAILURE });
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
      console.log("getEventById", response.data);
      dispatch({ type: GET_EVENT_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      dispatch({ type: GET_EVENT_BY_ID_FAILURE });
    }
  };

// Xóa mềm sự kiện (đặt isActive thành false)
export const deleteEvent =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_EVENT_REQUEST });
    try {
      await api.put(
        `${API_URL}/v1/event/${id}`,
        { isActive: false },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: DELETE_EVENT_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting event:", error);
      dispatch({ type: DELETE_EVENT_FAILURE });
    }
  };
