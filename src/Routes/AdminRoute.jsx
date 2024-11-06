import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Admin from "../AdminComponents/Admin/Admin";
import { CartProvider } from "../components/cart/CartContext";

const AdminRoute = () => {
  // const { role } = useSelector((state) => state.auth);
  // if (role !== 1) {
  //   return <Navigate to="/" replace />;
  // }

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
