import axios from "axios";
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
  GET_BILL_BY_ID_FAILURE,
} from "./ActionType";
import { API_URL } from "../../config/api";

export const getBills = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/bill/list`);
    console.log("getBills", response.data.data);
    dispatch({
      type: GET_BILLS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: GET_BILLS_FAILURE,
      // payload: error.response?.data?.message || "Failed to fetch bills",
    });
  }
};

//
export const createBill = (billData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/v1/bill/create`, billData);
    dispatch({
      type: CREATE_BILL_SUCCESS,
      payload: response.data.createNew,
    });
  } catch (error) {
    dispatch({
      type: CREATE_BILL_FAILURE,
      //payload: error.response?.data?.message || "Failed to create bill",
    });
  }
};

export const updateBill =
  ({ id, billData }) =>
  async (dispatch) => {
    try {
      const response = await axios.put(`${API_URL}/v1/bill/${id}`, billData);
      dispatch({
        type: UPDATE_BILL_SUCCESS,
        payload: response.data.updatedBill,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_BILL_FAILURE,
        payload: error.response?.data?.message || "Failed to update bill",
      });
    }
  };

export const getBillsByAccount = (accountId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/bill/account/${accountId}`);
    dispatch({
      type: GET_BILLS_BY_ACCOUNT_SUCCESS,
      payload: {
        accountId: accountId,
        bills: response.data.bills,
      },
    });
  } catch (error) {
    dispatch({
      type: GET_BILLS_BY_ACCOUNT_FAILURE,
      payload:
        error.response?.data?.message || "Failed to fetch bills by account",
    });
  }
};

export const getBillById =
  ({ id, jwt }) =>
  async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/v1/bill/get/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_BILL_BY_ID_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({
        type: GET_BILL_BY_ID_FAILURE,
        payload: error,
      });
    }
  };
