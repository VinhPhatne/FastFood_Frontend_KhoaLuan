import React, { useEffect } from "react";
import AdminSideBar from "./AdminSideBar";
import { Route, Routes } from "react-router-dom";
//import FoodCategory from "../FoodCategory/FoodCategory";
import { useDispatch, useSelector } from "react-redux";
import AdminHeader from "./AdminHeader";
import Account from "../Account/Account";

import Bill from "../Bill/Bill";
import BillDetailTable from "../Bill/BillDetailTable";
import Dashboard from "../DashBoard/Dashboard";
const Manager = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const handleClose = () => {};



  return (
    <div>
      <AdminHeader />
      <div className="lg:flex ">
        <div className="lg:w-[15%]">
          <AdminSideBar handleClose={handleClose} />
        </div>
        <div className="lg:w-[85%]">
          <Routes>
          <Route path="/" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/bill/:id" element={<BillDetailTable />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Manager;
