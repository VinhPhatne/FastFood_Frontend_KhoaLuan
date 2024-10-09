import {
  CREATE_CATEGORY_SUCCESS,
  GET_CATEGORIES,
  UPDATE_CATEGORY_SUCCESS,
} from "./ActionType";

const initialState = {
  categories: [],
  update: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, categories: action.payload };

    case CREATE_CATEGORY_SUCCESS:
      return { ...state, categories: [...state.categories, action.payload] };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    default:
      return state;
  }
};
