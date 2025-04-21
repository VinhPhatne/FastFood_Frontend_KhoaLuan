import axios from "axios";
import {
  CREATE_INGREDIENT_REQUEST,
  CREATE_INGREDIENT_SUCCESS,
  CREATE_INGREDIENT_FAILURE,
  GET_INGREDIENTS,
  UPDATE_INGREDIENT_REQUEST,
  UPDATE_INGREDIENT_SUCCESS,
  UPDATE_INGREDIENT_FAILURE,
  GET_INGREDIENT_BY_ID_REQUEST,
  GET_INGREDIENT_BY_ID_SUCCESS,
  GET_INGREDIENT_BY_ID_FAILURE,
  DELETE_INGREDIENT_REQUEST,
  DELETE_INGREDIENT_SUCCESS,
  DELETE_INGREDIENT_FAILURE,
  GET_EXPENSE_SUCCESS,
  GET_EXPENSE_FAILURE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";

// Lấy danh sách sự kiện
export const getIngredient =
  ({ jwt }) =>
  async (dispatch) => {
    try {
      const { data } = await api.get(`${API_URL}/v1/ingredient/list`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_INGREDIENTS, payload: data });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

// Tạo mới sự kiện
export const createIngredient =
  ({ name, unit, quantity, price, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_INGREDIENT_REQUEST });
    try {
      const { data } = await api.post(
        `${API_URL}/v1/ingredient/create`,
        { name, unit, quantity, price },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error creating Ingredient:", error);
      dispatch({ type: CREATE_INGREDIENT_FAILURE });
      throw error;
    }
  };

// Cập nhật sự kiện theo id
export const updateIngredient =
  ({ id, name, unit, quantity, price, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_INGREDIENT_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/ingredient/${id}`,
        { name, unit, quantity, price },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      dispatch({ type: UPDATE_INGREDIENT_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error updating event:", error);
      dispatch({ type: UPDATE_INGREDIENT_FAILURE });
      throw error;
    }
  };

// Lấy chi tiết sự kiện theo ID
export const getIngredientById =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: GET_INGREDIENT_BY_ID_REQUEST });
    try {
      const response = await axios.get(`${API_URL}/v1/ingredient/get/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch({ type: GET_INGREDIENT_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching ingredient by ID:", error);
      dispatch({ type: GET_INGREDIENT_BY_ID_FAILURE });
    }
  };

// Xóa mềm sự kiện (đặt isActive thành false)
export const deleteIngredient =
  ({ id }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_INGREDIENT_REQUEST });
    try {
      await api.delete(`${API_URL}/v1/ingredient/delete/${id}`);
      dispatch({ type: DELETE_INGREDIENT_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      dispatch({ type: DELETE_INGREDIENT_FAILURE });
    }
  };

export const getExpense = (year) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/ingredient/getexpenses`, {
      params: { year },
    });
    const transformedData = response.data.data.map((item) => ({
      name: new Date(2024, item.month - 1).toLocaleString("default", {
        month: "short",
      }),
      Expense: item.totalExpense,
    }));

    dispatch({ type: GET_EXPENSE_SUCCESS, payload: transformedData });
  } catch (error) {
    console.error("Error fetching Expense data:", error);
    dispatch({ type: GET_EXPENSE_FAILURE, payload: error.message });
  }
};
