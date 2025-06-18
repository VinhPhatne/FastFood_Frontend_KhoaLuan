import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getListBills, getRevenue } from "../../components/State/Bill/Action";
import { getExpense } from "../../components/State/Import/Action";

export default function TransactionChart() {
  const dispatch = useDispatch();
  const { data, error } = useSelector((state) => state.billReducer);
  const { dataIngredient } = useSelector((state) => state.ingredientReducer);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { products } = useSelector((state) => state.productReducer);
  const [selectedProduct, setSelectedProduct] = useState("");
  useEffect(() => {
    dispatch(getRevenue(selectedYear, selectedProduct));
    dispatch(getExpense(selectedYear));
    dispatch(getListBills());
  }, [dispatch, selectedYear, selectedProduct]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

    const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  const mergedData = Array.from({ length: 12 }, (_, index) => {
    const monthName = new Date(2024, index).toLocaleString("default", {
      month: "short",
    });

    const incomeItem = data.find((item) => item.name === monthName);
    const expenseItem = dataIngredient.find((item) => item.name === monthName);

    return {
      name: monthName,
      Income: incomeItem ? incomeItem.Income : 0,
      Expense: expenseItem ? expenseItem.Expense : 0,
    };
  });

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <strong className="text-gray-700 text-xl font-medium">Biểu đồ doanh thu</strong>
        <div className='flex items-center gap-4'>
        <select
          className="border border-gray-300 rounded-md p-2 bg-white text-gray-700"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {generateYearOptions()}
        </select>
          <div className="flex justify-end">
            <select
              value={selectedProduct}
              onChange={handleProductChange}
              className="border border-gray-300 rounded-md p-2 bg-white text-gray-700"
            >
              <option value="">Chọn sản phẩm</option>
              {Array.isArray(products?.products) && products.products.length > 0 ? (
                products.products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có sản phẩm nào
                </option>
              )}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={mergedData}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Income" fill="#0ea5e9" />
            <Bar dataKey="Expense" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
