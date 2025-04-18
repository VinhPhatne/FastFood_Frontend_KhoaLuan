import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { authReducer } from "./Authentication/Reducer";
import { thunk } from "redux-thunk";
import { categoryReducer } from "./Category/Reducer";
import productReducer from "./Product/Reducer";
import { eventReducer } from "./Event/Reducer";
import { userReducer } from "./User/Reducer";
import { voucherReducer } from "./voucher/Reducer";
import { billReducer } from "./Bill/Reducer";
import { ingredientReducer } from "./Import/Reducer";
import { optionalReducer } from "./Optional/Reducer";
import { choiceReducer } from "./Choice/Reducer";
import recommendationReducer, { relatedProductsReducer } from './Recommandation/Reducer';

const rooteReducer = combineReducers({
  auth: authReducer,
  categoryReducer: categoryReducer,
  productReducer: productReducer,
  eventReducer: eventReducer,
  userReducer: userReducer,
  voucherReducer : voucherReducer,
  billReducer: billReducer,
  ingredientReducer: ingredientReducer,
  optionalReducer : optionalReducer,
  choiceReducer : choiceReducer,
  recommendations: recommendationReducer,
  relatedProducts: relatedProductsReducer,
});

export const store = legacy_createStore(rooteReducer, applyMiddleware(thunk));
