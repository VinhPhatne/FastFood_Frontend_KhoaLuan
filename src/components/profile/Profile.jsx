import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../header/Header";
import UserProfile from "./UserProfile";
import ProfileSideBar from "./ProfileSideBar";
import ChangePassword from "./ChangePassword";
import Bill from "./Bill";

const Profile = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const handleClose = () => {};

  return (
    <div>
      <Header />
      <div className="lg:flex h-1/3">
        <div className="ml-48 w-1/3 h-1/3">
          <ProfileSideBar handleClose={handleClose} />
        </div>
        <div className="w-2/3 mr-28 h-1/3">
          <Routes>
            <Route path="/" element={<UserProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/orders" element={<Bill />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Profile;
