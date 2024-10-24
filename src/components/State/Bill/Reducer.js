import {
  GET_BILLS_SUCCESS,
  GET_BILLS_FAILURE,
  CREATE_BILL_SUCCESS,
  CREATE_BILL_FAILURE,
  UPDATE_BILL_SUCCESS,
  UPDATE_BILL_FAILURE,
  GET_BILLS_BY_ACCOUNT_SUCCESS,
  GET_BILLS_BY_ACCOUNT_FAILURE,
  GET_BILL_BY_ID_SUCCESS,
  GET_REVENUE_SUCCESS,
  GET_REVENUE_FAILURE,
} from "./ActionType";

const initialState = {
  bills: [],
  billsByAccount: {},
  error: null,
  selectedBill: null,
  data: [],
};

export const billReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILLS_SUCCESS:
      return {
        ...state,
        bills: action.payload,
        error: null,
      };
    case GET_BILLS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case CREATE_BILL_SUCCESS:
      return {
        ...state,
        bills: [...state.bills, action.payload],
        error: null,
      };
    case CREATE_BILL_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_BILL_SUCCESS:
      return {
        ...state,
        bills: state.bills.map((bill) =>
          bill._id === action.payload._id ? action.payload : bill
        ),
        error: null,
      };
    case UPDATE_BILL_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BILLS_BY_ACCOUNT_SUCCESS:
      return {
        ...state,
        billsByAccount: {
          ...state.billsByAccount,
          [action.payload.accountId]: action.payload.bills,
        },
        error: null,
      };
    case GET_BILLS_BY_ACCOUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BILL_BY_ID_SUCCESS:
      return {
        ...state,
        selectedBill: action.payload,
      };
    case GET_REVENUE_SUCCESS:
      return { ...state, data: action.payload, error: null };
    case GET_REVENUE_FAILURE:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default billReducer;
