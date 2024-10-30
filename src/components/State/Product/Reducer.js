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
} from "./ActionType";

const initialState = {
  products: [],
  productsByCategory: {},
  error: null,
  selectedProduct: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        error: null,
      };
    case GET_PRODUCTS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [...state.products, action.payload],
        error: null,
      };
    case CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: Array.isArray(state.products)
          ? state.products.map((product) =>
              product._id === action.payload._id ? action.payload : product
            )
          : [],
        error: null,
      };
    case UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_PRODUCTS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        productsByCategory: {
          ...state.productsByCategory,
          [action.payload.categoryId]: action.payload.products,
        },
        error: null,
      };
    case GET_PRODUCTS_BY_CATEGORY_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        selectedProduct: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
