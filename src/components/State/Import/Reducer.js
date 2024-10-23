import {
  GET_INGREDIENTS,
  CREATE_INGREDIENT_SUCCESS,
  UPDATE_INGREDIENT_SUCCESS,
  DELETE_INGREDIENT_SUCCESS,
  GET_INGREDIENT_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
  ingredients: [],
  selectedIngredient: null,
};

export const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INGREDIENTS:
      return { ...state, ingredients: action.payload };

    case CREATE_INGREDIENT_SUCCESS:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case UPDATE_INGREDIENT_SUCCESS:
      return {
        ...state,
        ingredients: state.ingredients.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case DELETE_INGREDIENT_SUCCESS:
      return {
        ...state,
        ingredients: state.ingredients.filter((item) => item.id !== action.payload),
      };

    case GET_INGREDIENT_BY_ID_SUCCESS:
      return { ...state, selectedIngredient: action.payload };

    default:
      return state;
  }
};
