import axios from "axios";
import {
  CREATE_OPTIONAL_REQUEST,
  CREATE_OPTIONAL_SUCCESS,
  CREATE_OPTIONAL_FAILURE,
  GET_OPTIONALS,
  UPDATE_OPTIONAL_REQUEST,
  UPDATE_OPTIONAL_SUCCESS,
  UPDATE_OPTIONAL_FAILURE,
  GET_OPTIONAL_BY_ID_REQUEST,
  GET_OPTIONAL_BY_ID_SUCCESS,
  GET_OPTIONAL_BY_ID_FAILURE,
  DELETE_OPTIONAL_REQUEST,
  DELETE_OPTIONAL_SUCCESS,
  DELETE_OPTIONAL_FAILURE,
} from "./ActionType";
import { API_URL } from "../../config/api";

export const getOptionals =
  ({ jwt }) =>
  async (dispatch) => {
    try {
      const { data } = await axios.get(`${API_URL}/v1/optional/list`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_OPTIONALS, payload: data });
    } catch (error) {
      console.error("Error fetching optionals:", error);
    }
  };

// Tạo mới optional
export const createOptional =
  ({ name, details, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_OPTIONAL_REQUEST });
    try {
      const { data } = await axios.post(
        `${API_URL}/v1/optional/create`,
        { name, details },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: CREATE_OPTIONAL_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.error("Error creating optional:", error);
      dispatch({ type: CREATE_OPTIONAL_FAILURE });
      throw error;
    }
  };

// Cập nhật optional theo id
export const updateOptional =
  ({ id, name, details, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_OPTIONAL_REQUEST });
    try {
      const { data } = await axios.put(
        `${API_URL}/v1/optional/${id}`,
        { name, details },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: UPDATE_OPTIONAL_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error updating optional:", error);
      dispatch({ type: UPDATE_OPTIONAL_FAILURE });
      throw error;
    }
  };

// Lấy chi tiết optional theo ID
export const getOptionalById =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_OPTIONAL_BY_ID_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/v1/optional/get/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_OPTIONAL_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching optional by ID:", error);
      dispatch({ type: GET_OPTIONAL_BY_ID_FAILURE });
    }
  };

// Xóa optional
export const deleteOptional =
  ({ id }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_OPTIONAL_REQUEST });
    try {
      await axios.delete(`${API_URL}/v1/optional/delete/${id}`);
      dispatch({ type: DELETE_OPTIONAL_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting optional:", error);
      dispatch({ type: DELETE_OPTIONAL_FAILURE });
    }
  };
