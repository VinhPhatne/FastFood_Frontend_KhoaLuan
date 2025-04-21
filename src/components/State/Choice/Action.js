import axios from "axios";
import {
  CREATE_CHOICE_REQUEST,
  CREATE_CHOICE_SUCCESS,
  CREATE_CHOICE_FAILURE,
  GET_CHOICES_BY_OPTIONAL_ID,
  UPDATE_CHOICE_REQUEST,
  UPDATE_CHOICE_SUCCESS,
  UPDATE_CHOICE_FAILURE,
  GET_CHOICE_BY_ID_REQUEST,
  GET_CHOICE_BY_ID_SUCCESS,
  GET_CHOICE_BY_ID_FAILURE,
  DELETE_CHOICE_REQUEST,
  DELETE_CHOICE_SUCCESS,
  DELETE_CHOICE_FAILURE,
} from "./ActionType";
import { API_URL } from "../../config/api";

export const getChoicesByOptionalId =
  ({ optionalId, jwt }) =>
  async (dispatch) => {
    try {
      const { data } = await axios.get(`${API_URL}/v1/choice/get-choice`, {
        params: { optionalId },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_CHOICES_BY_OPTIONAL_ID, payload: data });
      return data.choices;
    } catch (error) {
      console.error("Error fetching choices by optionalId:", error);
    }
  };

// Tạo mới choice
export const createChoice =
  ({ name, additionalPrice, optional }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_CHOICE_REQUEST });
    try {
      const { data } = await axios.post(`${API_URL}/v1/choice/create`, {
        name,
        additionalPrice,
        optional,
      });
      dispatch({ type: CREATE_CHOICE_SUCCESS, payload: data });
      return data;
    } catch (error) {
      console.error("Error creating choice:", error);
      dispatch({ type: CREATE_CHOICE_FAILURE });
      throw error;
    }
  };

// Cập nhật choice theo id
export const updateChoice =
  ({ id, name, additionalPrice, optional }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_CHOICE_REQUEST });
    try {
      const { data } = await axios.put(
        `${API_URL}/v1/choice/${id}`,
        { name, additionalPrice, optional },
      );
      dispatch({ type: UPDATE_CHOICE_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error updating choice:", error);
      dispatch({ type: UPDATE_CHOICE_FAILURE });
      throw error;
    }
  };

// Lấy chi tiết choice theo ID
export const getChoiceById =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_CHOICE_BY_ID_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/v1/choice/get/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_CHOICE_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching choice by ID:", error);
      dispatch({ type: GET_CHOICE_BY_ID_FAILURE });
    }
  };

// Xóa choice
export const deleteChoice =
  ({ id }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_CHOICE_REQUEST });
    try {
      await axios.delete(`${API_URL}/v1/choice/delete/${id}`);
      dispatch({ type: DELETE_CHOICE_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting choice:", error);
      dispatch({ type: DELETE_CHOICE_FAILURE });
    }
  };
