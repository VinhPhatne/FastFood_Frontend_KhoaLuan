import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import CustomerRoute from "./CustomerRoute";
import ManagerRoute from "./ManagerRoute";

const Routers = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="/manager/*" element={<ManagerRoute />} />
      <Route path="/*" element={<CustomerRoute />} />
    </Routes>
  );
};

export default Routers;
