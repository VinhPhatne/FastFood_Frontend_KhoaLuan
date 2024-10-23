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

const Admin = () => {
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
            <Route path="/bill" element={<Bill />} />
            <Route path="/bill/:id" element={<BillDetailTable />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
