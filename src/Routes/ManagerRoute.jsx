import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Manager from "../ManageComponents/Manager/Manager";
import { CartProvider } from "../components/cart/CartContext";

const ManagerRoute = () => {
  const { role } = useSelector((state) => state.auth);
  if (role !== 2) {
    return <Navigate to="/" replace />;
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
