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
        `${API_URL}/v1/category/create`,
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
        `${API_URL}/v1/category/${id}`,
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
export const deleteCategory =
  ({ id, jwt }) =>
  async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    try {
      const { data } = await api.put(
        `${API_URL}/v1/category/delete/${id}`,
        { isActive: false },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("deleteCategory", data);
      dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
    } catch (error) {
      console.log("error", error);
      dispatch({ type: DELETE_CATEGORY_FAILURE });
    }
  };
