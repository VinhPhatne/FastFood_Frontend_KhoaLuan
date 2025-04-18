import React, { useEffect } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/header/Header";
import Profile from "../components/profile/Profile";
import Cart from "../components/cart/Cart";
import Checkout from "../components/cart/Checkout";
import Footer from "../components/footer/Footer";
import PaymentSuccess from "../components/cart/PaymentSuccess";
import AboutUs from "../components/AboutMe/AboutUs";
import OTP from "../components/otp/OTP";
import BillDetail from "../components/profile/BillDetail";
import { CartProvider } from "../components/cart/CartContext";
import Promotion from "../components/card/Promotion";
import {
  getUserProfile,
  setUserRole,
} from "../components/State/Authentication/Action";
import { useDispatch, useSelector } from "react-redux";
import ProductDetail from '../components/card/ProductDetail';

const CustomerRoute = () => {

  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const storedRole = localStorage.getItem("role") || "2";

  const { role } = useSelector((state) => ({
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

  return (
    <CartProvider>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/cart/*" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/detail/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default CustomerRoute;
