import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";
import { thunk } from "redux-thunk";
import { categoryReducer } from "./Category/Reducer";
import productReducer from "./Product/Reducer";
import { eventReducer } from "./Event/Reducer";
import { userReducer } from "./User/Reducer";
import { voucherReducer } from "./voucher/Reducer";
// import { restaurantReducer } from "./Restaurant/Reducer";
// import { menuItemReducer } from "./Menu/Reducer";
// import { cartReducer } from "./Cart/Reducer";
// import { orderReducer } from "./Order/Reducer";
// import { ingredientReducer } from "./Ingredients/Reducer";
// import { restaurantsOrderReducer } from "./RestaurantOrder/Reducer";

const rooteReducer = combineReducers({
  auth: authReducer,
  categoryReducer: categoryReducer,
  productReducer: productReducer,
  eventReducer: eventReducer,
  userReducer: userReducer,
  voucherReducer : voucherReducer,

  // restaurant: restaurantReducer,
  // menu: menuItemReducer,
  // cart: cartReducer,
  // order: orderReducer,
  // restaurantOrder: restaurantsOrderReducer,
  // ingredients: ingredientReducer,
});

export const store = legacy_createStore(rooteReducer, applyMiddleware(thunk));
