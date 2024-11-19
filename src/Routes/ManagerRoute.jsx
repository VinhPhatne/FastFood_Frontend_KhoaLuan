import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Manager from "../ManageComponents/Manager/Manager";
import { CartProvider } from "../components/cart/CartContext";
import { notification, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  getUserProfile,
  setUserRole,
} from "../components/State/Authentication/Action";
const ManagerRoute = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const storedRole = localStorage.getItem("role") || "2";

  const { role, isLoading } = useSelector((state) => ({
    role: state.auth.role,
    isLoading: state.auth.isLoading,
  }));

  const userProfile = useSelector((state) => state.auth.user);
  const check = userProfile?.role || "";
  useEffect(() => {
    if (!role) {
      dispatch(getUserProfile());
    }
    dispatch(getUserProfile());
    dispatch(setUserRole(storedRole));
  }, [dispatch, jwt, storedRole]);

  // if (isLoading) {
  //   return <Spin tip="Loading..." />;
  // }

  if (!role) {
    dispatch(getUserProfile());
  } else {
    if (role != "2") {
      notification.error({
        message: "Truy cập bị từ chối",
        description: "Bạn không có quyền truy cập trang này.",
      });
      return <Navigate to="/" replace />;
    }
  }

  return (
    <CartProvider>
      <div>
        <Routes>
          <Route path="/*" element={<Manager />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default ManagerRoute;
