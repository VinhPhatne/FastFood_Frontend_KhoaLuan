import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Admin from "../AdminComponents/Admin/Admin";

const AdminRoute = () => {
  //const { restaurant } = useSelector((store) => store);

  return (
    <div>
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default AdminRoute;
