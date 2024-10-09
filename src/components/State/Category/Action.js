import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  GET_CATEGORIES,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";

// Lấy danh sách categories
export const getCategories =
  ({ jwt }) =>
  async (dispatch) => {
    try {
      const { data } = await api.get(`${API_URL}/v1/category/list`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("getCategories", data);
      dispatch({ type: GET_CATEGORIES, payload: data });
    } catch (error) {
      console.log("error", error);
    }
  };

// Tạo mới category
export const createCategory =
  ({ name, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
      const { data } = await api.post(
        "/category/create",
        { name },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("createCategory", data);
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
      console.log("error", error);
      dispatch({ type: CREATE_CATEGORY_FAILURE });
    }
  };

// Cập nhật category theo id
export const updateCategory =
  ({ id, name, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });
    try {
      const { data } = await api.put(
        `/category/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("updateCategory", data);
      dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
      console.log("error", error);
      dispatch({ type: UPDATE_CATEGORY_FAILURE });
    }
  };
