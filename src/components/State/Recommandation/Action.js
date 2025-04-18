import axios from 'axios';
import { API_URL } from '../../config/api';
import { GET_RECOMMENDATIONS_SUCCESS, GET_RECOMMENDATIONS_FAILURE, GET_RELATED_PRODUCTS_SUCCESS, GET_RELATED_PRODUCTS_FAILURE } from './ActionType';

export const getRecommendations = ({jwt}) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/recommendations/recommendations`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({
      type: GET_RECOMMENDATIONS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_RECOMMENDATIONS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch recommendations',
    });
  }
};

export const getRelatedProducts = (productId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/recommendations/products/related/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    dispatch({
      type: GET_RELATED_PRODUCTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_RELATED_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch related products',
    });
  }
};