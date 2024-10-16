import {
  GET_VOUCHERS,
  CREATE_VOUCHER_SUCCESS,
  UPDATE_VOUCHER_SUCCESS,
  DELETE_VOUCHER_SUCCESS,
  GET_VOUCHER_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
  vouchers: [],
  selectedvouchers: null,
};

export const voucherReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VOUCHERS:
      return { ...state, vouchers: action.payload };

    case CREATE_VOUCHER_SUCCESS:
      return { ...state, vouchers: [...state.vouchers, action.payload] };

    case UPDATE_VOUCHER_SUCCESS:
      return {
        ...state,
        vouchers: state.vouchers.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case DELETE_VOUCHER_SUCCESS:
      return {
        ...state,
        vouchers: state.vouchers.filter((item) => item.id !== action.payload),
      };

    case GET_VOUCHER_BY_ID_SUCCESS:
      return { ...state, selectedvouchers: action.payload };

    default:
      return state;
  }
};
