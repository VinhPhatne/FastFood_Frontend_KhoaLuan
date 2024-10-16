import {
  GET_VOUCHERS,
  CREATE_VOUCHER_SUCCESS,
  UPDATE_VOUCHER_SUCCESS,
  DELETE_VOUCHER_SUCCESS,
  GET_VOUCHER_BY_ID_SUCCESS,
} from "./ActionType";

const initialState = {
  voucher: [],
  selectedVoucher: null,
};

export const voucherReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VOUCHERS:
      return { ...state, voucher: action.payload };

    case CREATE_VOUCHER_SUCCESS:
      return { ...state, voucher: [...state.voucher, action.payload] };

    case UPDATE_VOUCHER_SUCCESS:
      return {
        ...state,
        voucher: state.voucher.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case DELETE_VOUCHER_SUCCESS:
      return {
        ...state,
        voucher: state.voucher.filter((item) => item._id !== action.payload),
      };

    case GET_VOUCHER_BY_ID_SUCCESS:
      return { ...state, selectedVoucher: action.payload };

    default:
      return state;
  }
};
