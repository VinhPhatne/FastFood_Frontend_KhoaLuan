import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/header/Header";
import UserProfile from "../components/profile/UserProfile";
import ChangePassword from "../components/profile/ChangePassword";
import Profile from "../components/profile/Profile";
import Cart from "../components/cart/Cart";
import Checkout from "../components/cart/Checkout";
import Footer from "../components/footer/Footer";
import PaymentSuccess from "../components/cart/PaymentSuccess";
import AboutUs from "../components/AboutMe/AboutUs";
import OTP from "../components/otp/OTP";
import { useSelector } from "react-redux";
import BillDetail from "../components/profile/BillDetail";
import { CartProvider } from "../components/cart/CartContext";
import OrderDetails6 from "../components/cart/OrderDetail";
import Promotion from "../components/card/Promotion";

const CustomerRoute = () => {
  // const { role } = useSelector((state) => state.auth);
  // if (role !== 2) {
  //   return <Navigate to="/admin" replace />;
  // }
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
          <Route path="/order-detail" element={<OrderDetails6 />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/otp" element={<OTP />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default CustomerRoute;
