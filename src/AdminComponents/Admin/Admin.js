import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";
import FoodCategory from "../Category/FoodCategory";
import CreateProductForm from "../Product/CreateProductForm";
import Product from "../Product/Product";
import Event from "../Event/Event";
import Account from "../Account/Account";
import UpdateProductForm from "../Product/UpdateProductForm";
import Bill from "../Bill/Bill";
import BillDetailTable from "../Bill/BillDetailTable";
import Voucher from "../Voucher/Voucher";
import StockIn from "../StockIn/StockIn";
import Dashboard from "../DashBoard/Dashboard";
import Optional from "../Optional/Optional";
import ChoiceTable from "../Choice/ChoiceTable";
import PageNotFound from '../../Routes/PageNotFound';

const Admin = () => {
  const location = useLocation();
  const handleClose = () => {};

  // Define valid routes
  const validRoutes = [
    '/admin',
    '/admin/',
    '/admin/category',
    '/admin/product',
    '/admin/product/create',
    '/admin/product/:id',
    '/admin/event',
    '/admin/account',
    '/admin/voucher',
    '/admin/import',
    '/admin/optional',
    '/admin/optional/choice-table/:optionalId',
    '/admin/bill',
    '/admin/bill/:id',
  ];

  // Check if current route is NotFound
  const isNotFound = !validRoutes.some((path) => {
    if (path.includes(':id') || path.includes(':optionalId')) {
      // Handle dynamic routes (e.g., /admin/product/:id, /admin/optional/choice-table/:optionalId)
      const basePath = path.replace(/:id|:optionalId/g, '[a-zA-Z0-9-]+');
      const regex = new RegExp(`^${basePath}$`);
      return regex.test(location.pathname);
    }
    return location.pathname === path;
  });

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
            <Route path="category" element={<FoodCategory />} />
            <Route path="product" element={<Product />} />
            <Route path="product/create" element={<CreateProductForm />} />
            <Route path="product/:id" element={<UpdateProductForm />} />
            <Route path="event" element={<Event />} />
            <Route path="account" element={<Account />} />
            <Route path="voucher" element={<Voucher />} />
            <Route path="import" element={<StockIn />} />
            <Route path="optional" element={<Optional />} />
            <Route path="bill" element={<Bill />} />
            <Route path="bill/:id" element={<BillDetailTable />} />
            <Route path="optional/choice-table/:optionalId" element={<ChoiceTable />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;