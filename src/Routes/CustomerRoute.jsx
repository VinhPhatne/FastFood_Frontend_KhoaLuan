import React from "react";

import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Header from "../components/header/Header";
import UserProfile from "../components/profile/UserProfile";
import ChangePassword from "../components/profile/ChangePassword";

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
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </div>
  );
};

export default CustomerRoute;
