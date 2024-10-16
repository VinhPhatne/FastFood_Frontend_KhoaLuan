import axios from "axios";
import {
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  GET_PRODUCTS_BY_CATEGORY_SUCCESS,
  GET_PRODUCTS_BY_CATEGORY_FAILURE,
  GET_PRODUCT_BY_ID_SUCCESS,
  GET_PRODUCT_BY_ID_FAILURE,
} from "./ActionType";
import { API_URL, api } from "../../config/api";

export const getProducts = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/product/list`);
    dispatch({
      type: GET_PRODUCTS_SUCCESS,
      payload: response.data.products,
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCTS_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export const getProductsListPage =
  ({ jwt, page = 1, search, cateId, isSelling }) =>
  async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/v1/product/listpage`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          page: page,
          search: search,
          cateId: cateId,
          isSelling: isSelling,
        },
      });

      dispatch({
        type: GET_PRODUCTS_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: GET_PRODUCTS_FAILURE,
        payload: error.response?.data?.message || "Failed to fetch products",
      });
    }
  };

export const createProduct = (productData) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/v1/product/create`,
      productData
    );
    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: response.data.createNew,
    });
  } catch (error) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export const updateProduct =
  ({ id, productData }) =>
  async (dispatch) => {
    try {
      const response = await axios.put(
        `${API_URL}/v1/product/${id}`,
        productData
      );
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: response.data.updateNew,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      dispatch({
        type: UPDATE_PRODUCT_FAILURE,
      });
    }
  };

export const getProductsByCategory = (categoryId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${API_URL}/v1/product/category/${categoryId}`
    );
    dispatch({
      type: GET_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: {
        categoryId: categoryId,
        products: response.data.products,
      },
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCTS_BY_CATEGORY_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export const getProductById =
  ({ id, jwt }) =>
  async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/v1/product/get/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_PRODUCT_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      dispatch({ type: GET_PRODUCT_BY_ID_FAILURE, payload: error });
      return null;
    }
  };
