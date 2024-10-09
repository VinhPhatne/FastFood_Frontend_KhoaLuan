import axios from 'axios';
import {
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAILURE,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  GET_PRODUCTS_BY_CATEGORY_SUCCESS,
  GET_PRODUCTS_BY_CATEGORY_FAILURE,
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

export const createProduct = (productData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/v1/product/create`, productData);
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

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    const response = await axios.put(`${API_URL}/v1/product/${id}`, productData);
    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: response.data.updateNew,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response.data.message,
    });
  }
};

export const getProductsByCategory = (categoryId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/product/category/${categoryId}`);
    dispatch({
      type: GET_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCTS_BY_CATEGORY_FAILURE,
      payload: error.response.data.message,
    });
  }
};
