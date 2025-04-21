import {
  GET_RECOMMENDATIONS_SUCCESS,
  GET_RECOMMENDATIONS_FAILURE,
  GET_RELATED_PRODUCTS_SUCCESS,
  GET_RELATED_PRODUCTS_FAILURE,
} from "./ActionType";
const initialState = {
  recommendations: [],
  relatedProducts: [],
  error: null,
};

export const recommendationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        recommendations: action.payload,
        error: null,
      };
    case GET_RECOMMENDATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const relatedProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RELATED_PRODUCTS_SUCCESS:
      return {
        ...state,
        relatedProducts: action.payload,
        error: null,
      };
    case GET_RELATED_PRODUCTS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default recommendationReducer;