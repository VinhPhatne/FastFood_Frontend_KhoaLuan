import {
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  GET_CATEGORIES,
  GET_CATEGORY_BY_ID_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_SUCCESS,
} from "./ActionType";

const initialState = {
  categories: [],
  update: null,
  selectedCategory: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, categories: action.payload };

    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: Array.isArray(state.categories)
          ? state.categories.concat(action.payload)
          : [action.payload],
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        // categories: Array.isArray(state.categories)
        //   ? state.categories.map((item) =>
        //       item.id === action.payload.id ? action.payload : item
        //     )
        //   : [action.payload],

       categories: Array.isArray(state.categories)
        ? state.categories.map((item) =>
            item.id === action.payload.id ? action.payload : item
          )
        : [action.payload],
      };

    case UPDATE_CATEGORY_FAILURE:
          return {
            ...state,
            error: action.payload,
          };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: Array.isArray(state.categories)
          ? state.categories?.filter((item) => item.id !== action.payload)
          : [], 
      };

    case GET_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    default:
      return state;
  }
};
