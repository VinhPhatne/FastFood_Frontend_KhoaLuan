import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Manager from "../ManageComponents/Manager/Manager";

const ManagerRoute = () => {
  // const { role } = useSelector((state) => state.auth);
  // if (role !== 1) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <div>
      <Routes>
        <Route path="/*" element={<Manager />} />
      </Routes>
    </div>
  );
};

export default ManagerRoute;
