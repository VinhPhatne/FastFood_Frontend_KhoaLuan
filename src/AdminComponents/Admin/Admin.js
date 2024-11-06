import React, { useEffect } from "react";
import AdminSideBar from "./AdminSideBar";
import { Route, Routes } from "react-router-dom";
//import FoodCategory from "../FoodCategory/FoodCategory";
import { useDispatch, useSelector } from "react-redux";
import FoodCategory from "../Category/FoodCategory";
import CreateProductForm from "../Product/CreateProductForm";
import Product from "../Product/Product";
import AdminHeader from "./AdminHeader";
import Event from "../Event/Event";
import Account from "../Account/Account";
import UpdateProductForm from "../Product/UpdateProductForm";
import CreateAccountForm from "../Account/CreateAccountForm";
import Bill from "../Bill/Bill";
import BillDetailTable from "../Bill/BillDetailTable";
import Voucher from "../Voucher/Voucher";
import StockIn from "../StockIn/StockIn";
import Dashboard from "../DashBoard/Dashboard";
import Optional from "../Optional/Optional";
import ChoiceTable from "../Choice/ChoiceTable";

const Admin = () => {
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
            <Route path="category" element={<FoodCategory />} />
            <Route path="/product" element={<Product />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/product/create" element={<CreateProductForm />} />
            <Route path="/product/:id" element={<UpdateProductForm />} />
            <Route path="/event" element={<Event />} />
            <Route path="/account" element={<Account />} />
            <Route path="/voucher" element={<Voucher />} />
            <Route path="/import" element={<StockIn />} />
            <Route path="/optional" element={<Optional />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/bill/:id" element={<BillDetailTable />} />
            <Route path="/optional/choice-table/:optionalId" element={<ChoiceTable />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
