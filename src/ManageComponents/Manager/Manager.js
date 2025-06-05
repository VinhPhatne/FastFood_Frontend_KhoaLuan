import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";
import Account from "../Account/Account";
import Bill from "../Bill/Bill";
import BillDetailTable from "../Bill/BillDetailTable";
import Dashboard from "../DashBoard/Dashboard";
import PageNotFound from '../../Routes/PageNotFound';

const Manager = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const location = useLocation();
  const handleClose = () => {};

  const isNotFound = ![
    '/manager',
    '/manager/account',
    '/manager/bill',
  ].some((path) => location.pathname == path || location.pathname.startsWith(path.replace(':id', '')));

  return (
    <div>
      {!isNotFound && <AdminHeader />}
      <div className="lg:flex">
        {!isNotFound && (
          <div className="lg:w-[15%]">
            <AdminSideBar handleClose={handleClose} />
          </div>
        )}
        <div className={isNotFound ? "w-full" : "lg:w-[85%]"}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/bill/:id" element={<BillDetailTable />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Manager;
