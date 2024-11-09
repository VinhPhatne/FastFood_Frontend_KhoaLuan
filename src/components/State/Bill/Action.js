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
  GET_REVENUE_SUCCESS,
  GET_REVENUE_FAILURE,
  GET_PRODUCT_SALE_SUCCESS,
  GET_PRODUCT_SALE_FAILURE,
} from "./ActionType";
import { API_URL } from "../../config/api";
import socket from "../../config/socket";

export const getBills = ({ page = 1, accountId, phone, state }) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/bill/list`, {
      params: {
        page: page,
        accountId: accountId,
        phone: phone,
        state: state, 
      },
    });
    console.log("getBills", response.data.data);
    dispatch({
      type: GET_BILLS_SUCCESS,
      payload: response.data.data,

      // pagination: response.data.pagination,
    });
  } catch (error) {
    dispatch({
      type: GET_BILLS_FAILURE,
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

    socket.emit("billCreated", { billData, status: "success" });
  } catch (error) {
    dispatch({
      type: CREATE_BILL_FAILURE,
      //payload: error.response?.data?.message || "Failed to create bill",
    });
  }
};

export const updateBillStatus = (id, newStatus) => async (dispatch) => {
  const billData = { state: newStatus };

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

export const getRevenue = (year) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/bill/getrevenue`, {
      params: { year },
    });
    console.log("CHECK", response.data);
    const transformedData = response.data.data.map((item) => ({
      name: new Date(2024, item.month - 1).toLocaleString("default", {
        month: "short",
      }),
      Income: item.totalRevenue || 0,
    }));

    dispatch({ type: GET_REVENUE_SUCCESS, payload: transformedData });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    dispatch({ type: GET_REVENUE_FAILURE, payload: error.message });
  }
};

export const getProductSale = () => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/v1/bill/get-product-sale`);
    dispatch({
      type: GET_PRODUCT_SALE_SUCCESS,
      payload: response.data.data.productSale,
    });
  } catch (error) {
    console.error("Error fetching product sale data:", error);
    dispatch({
      type: GET_PRODUCT_SALE_FAILURE,
      payload: error.message,
    });
  }
};
