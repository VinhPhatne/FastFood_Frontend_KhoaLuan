import React from "react";

import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/header/Header";
import UserProfile from "../components/profile/UserProfile";
import ChangePassword from "../components/profile/ChangePassword";
import Profile from "../components/profile/Profile";
import Cart from "../components/cart/Cart";
import Checkout from "../components/cart/Checkout";

const CustomerRoute = () => {
  return (
    // <div>
    //   <Header />
    //   <Slider />
    //   <Card />
    //   {/* <Review />
    //   <Advertise />
    //   <Expert />
    //   <Experter />
    //   <Suggest /> */}
    //   <Footer />
    // </div>

    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/cart/*" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* <Route path="/profile/change-password" element={<ChangePassword />} /> */}
      </Routes>
    </div>
  );
};

export default CustomerRoute;
