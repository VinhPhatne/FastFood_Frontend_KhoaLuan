import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Admin from "../AdminComponents/Admin/Admin";

const AdminRoute = () => {
  // const { role } = useSelector((state) => state.auth);
  // if (role !== 1) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div>
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default AdminRoute;
