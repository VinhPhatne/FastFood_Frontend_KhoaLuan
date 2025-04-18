import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  GET_CATEGORIES,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  GET_CATEGORY_BY_ID_REQUEST,
  GET_CATEGORY_BY_ID_SUCCESS,
  GET_CATEGORY_BY_ID_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  BLOCK_CATEGORY_REQUEST,
  BLOCK_CATEGORY_SUCCESS,
  BLOCK_CATEGORY_FAILURE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";
import axios from "axios";

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
      dispatch({ type: GET_CATEGORIES, payload: data });
    } catch (error) {
    }
  };

// Tạo mới category
export const createCategory =
  ({ name, image, jwt }) =>
  async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
      const { data } = await api.post(
        `${API_URL}/v1/category/create`,
        { name, image },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: CREATE_CATEGORY_FAILURE });
      throw error;
    }
  };

// Cập nhật category theo id
export const updateCategory =
  ({ id, name, image, jwt }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/category/${id}`,
        { name, image },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: UPDATE_CATEGORY_FAILURE });
      throw error;
    }
  };

// Lấy chi tiết category theo ID
// export const getCategoryById =
//   ({ id, jwt }) =>
//   async (dispatch) => {
//     dispatch({ type: GET_CATEGORY_BY_ID_REQUEST });
//     try {
//       const response = await api.get(`${API_URL}/v1/category/get/${id}`, {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       });
//       console.log("getCategoryById", response.data);
//       dispatch({ type: GET_CATEGORY_BY_ID_SUCCESS, payload: response.data });
//       //return data;
//     } catch (error) {
//       console.log("error", error);
//       dispatch({ type: GET_CATEGORY_BY_ID_FAILURE });
//     }
//   };

export const getCategoryById =
  ({ id, jwt }) =>
  async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/v1/category/get/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: "GET_CATEGORY_BY_ID_SUCCESS", payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      dispatch({ type: "GET_CATEGORY_BY_ID_FAILURE", payload: error });
      return null;
    }
  };

// Xóa mềm category (đặt isActive thành false)
export const blockCategory =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: BLOCK_CATEGORY_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/category/${id}`,
        { isActive: false },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: BLOCK_CATEGORY_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: BLOCK_CATEGORY_FAILURE });
    }
  };

  export const unblockCategory =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: BLOCK_CATEGORY_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/category/unblock/${id}`,
        { isActive: true },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      dispatch({ type: BLOCK_CATEGORY_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: BLOCK_CATEGORY_FAILURE });
    }
  };

export const deleteCategory =
  ({ id }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    try {
      await api.delete(`${API_URL}/v1/category/harddelete/${id}`);
      dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
    } catch (error) {
      console.error("Error deleting product:", error);
      dispatch({ type: DELETE_CATEGORY_FAILURE });
    }
  };
