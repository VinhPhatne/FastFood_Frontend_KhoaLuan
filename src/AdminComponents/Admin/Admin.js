import React, { useEffect } from "react";
import AdminSideBar from "./AdminSideBar";
import { Route, Routes } from "react-router-dom";
//import FoodCategory from "../FoodCategory/FoodCategory";
import { useDispatch, useSelector } from "react-redux";
import FoodCategory from "../Category/FoodCategory";
import CreateProductForm from "../Product/CreateProductForm";
import Product from "../Product/Product";
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
      <div className="lg:flex justify-between">
        <div>
          <AdminSideBar handleClose={handleClose} />
        </div>
        <div className="lg:w-[80%]">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} /> */}
            <Route path="category" element={<FoodCategory />} />
            {/* <Route path="/ingredients" element={<Ingredients />} /> */}
            {/* <Route path="/event" element={<Events />} />
            <Route path="/details" element={<RestaurantDetails />} />
            */}
            <Route path="/product" element={<Product />} />
            <Route path="/product/create" element={<CreateProductForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
