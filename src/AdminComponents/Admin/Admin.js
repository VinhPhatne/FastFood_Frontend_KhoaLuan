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
import EventTable from "../Voucher/VoucherTable";
//import { getRestaurantsCategory } from "../../component/State/Restaurant/Action";

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
            <Route path="/product/create" element={<CreateProductForm />} />
            <Route path="/event" element={<Event />} />
            <Route path="/account" element={<Account />} />
            <Route path="/voucher" element={<EventTable/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
