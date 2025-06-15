import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Admin from "../AdminComponents/Admin/Admin";
import { CartProvider } from "../components/cart/CartContext";
import { notification, Spin } from "antd";
import {
  getUserProfile,
  setUserRole,
} from "../components/State/Authentication/Action";

const AdminRoute = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const storedRole = localStorage.getItem("role") || "";

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
        if (storedRole != "1") {
          notification.error({
            message: "Truy cập bị từ chối",
            description: "Bạn không có quyền truy cập trang này.",
          });
          if (storedRole == "2") {
            return <Navigate to="/manager" replace />;
          }
          return <Navigate to="/" replace />;
        }
  } else {
    if (role != "1") {
      notification.error({
        message: "Truy cập bị từ chối",
        description: "Bạn không có quyền truy cập trang này.",
      });
      if (role == "2") {
        return <Navigate to="/manager" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return (
    <CartProvider>
      <div>
        <Routes>
          <Route path="/*" element={<Admin />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default AdminRoute;
