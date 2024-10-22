import React from "react";

import { Route, Routes } from "react-router-dom";
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

const CustomerRoute = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/cart/*" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/otp" element={<OTP />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default CustomerRoute;
