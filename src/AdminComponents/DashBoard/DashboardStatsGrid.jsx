import React, { useEffect, useState } from 'react';
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5';
import { getBills, getListBills, getRevenue } from "../../components/State/Bill/Action";
import { getExpense } from "../../components/State/Import/Action";
import { getProducts } from "../../components/State/Product/Action";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardStatsGrid() {
  const dispatch = useDispatch();
  const selectedYear = 2025;
  const { data: revenueData } = useSelector((state) => state.billReducer);
  const { dataIngredient: expenseData } = useSelector((state) => state.ingredientReducer);
  const { bills } = useSelector((state) => state.billReducer.bills);
  const { products } = useSelector((state) => state.productReducer);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getRevenue(selectedYear, selectedProduct));
    dispatch(getExpense(selectedYear));
    dispatch(getListBills());
  }, [dispatch, selectedYear, selectedProduct]);

  const handleProductChange = (e) => {
    console.log('e', e.target.value);
    setSelectedProduct(e.target.value);
  };

  const totalIncome = revenueData?.reduce((sum, month) => sum + (month.Income || 0), 0) ?? 0;
  const totalExpense = expenseData?.reduce((sum, month) => sum + (month.Expense || 0), 0) ?? 0;
  const totalProfit = totalIncome - totalExpense;
  const totalOrders = bills?.length ?? 0;

  return (
      <div className="flex gap-4">
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
            <IoBagHandle className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Doanh thu</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">{totalIncome.toLocaleString()} VND</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600">
            <IoPieChart className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Chi phí</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">{totalExpense.toLocaleString()} VND</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
            <IoPeople className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Lợi nhuận</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">{totalProfit.toLocaleString()} VND</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
            <IoCart className="text-2xl text-white" />
          </div>
          <div className="pl-4">
            <span className="text-sm text-gray-500 font-light">Tổng đơn hàng</span>
            <div className="flex items-center">
              <strong className="text-xl text-gray-700 font-semibold">{totalOrders}</strong>
            </div>
          </div>
        </BoxWrapper>
      </div>
  );
}

function BoxWrapper({ children }) {
  return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{children}</div>;
}