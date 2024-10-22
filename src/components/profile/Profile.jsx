import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
//import FoodCategory from "../FoodCategory/FoodCategory";
import { useDispatch, useSelector } from "react-redux";
import Header from "../header/Header";
import UserProfile from "./UserProfile";
import ProfileSideBar from "./ProfileSideBar";
import ChangePassword from "./ChangePassword";
import Footer from "../footer/Footer";
//import { getRestaurantsCategory } from "../../component/State/Restaurant/Action";

const Profile = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  //const { restaurant } = useSelector((store) => store);
  const handleClose = () => {};

  // useEffect(() => {
  //   dispatch(
  //     getRestaurantsCategory({
  //       jwt,
  //       restaurantId: restaurant.usersRestaurant?.id,
  //     })
  //   );
  //   dispatch(
  //     fetchRestaurantsOrder({
  //       jwt,
  //       restaurantId: restaurant.usersRestaurant?.id,
  //     })
  //   );
  // },[]);

  return (
    <div>
      <Header />
      <div className="lg:flex h-1/3">
        <div className="ml-48 w-1/3 h-1/3">
          <ProfileSideBar handleClose={handleClose} />
        </div>
        <div className="w-2/3 mr-28 h-1/3 mt-28">
          <Routes>
            <Route path="/" element={<UserProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
