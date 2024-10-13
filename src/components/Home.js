import React from "react";

import Header from "./header/Header";
import Slider from "./slider/Slider";
import Card from "./card/Card";
import Review from "./review/Review";
import Advertise from "./advertise/Advertise";
import Expert from "./expert/Expert";
import Experter from "./experter/Experter";
import Suggest from "./suggest/Suggest";
import Footer from "./footer/Footer";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./profile/UserProfile";
import ChangePassword from "./profile/ChangePassword";

const Home = () => {
  return (
    <div>
      {/* <Header /> */}
      <Slider />
      <Card />
      {/* <Review />
      <Advertise />
      <Expert />
      <Experter />
      <Suggest /> */}
      <Footer />
    </div>

    // <div>
    //   <Header />
    //   <Routes>
    //     {/* <Route path="/" element={<Home />} /> */}
    //     <Route path="/profile" element={<UserProfile />} />
    //     <Route path="/change-password" element={<ChangePassword />} />
    //   </Routes>
    // </div>
  );
};

export default Home;
