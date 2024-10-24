import axios from "axios";
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
import { getRevenue } from "../../components/State/Bill/Action";

// const data = [
// 	{
// 		name: 'Jan',
// 		Expense: 4000,
// 		Income: 2400
// 	},
// 	{
// 		name: 'Feb',
// 		Expense: 3000,
// 		Income: 1398
// 	},
// 	{
// 		name: 'Mar',
// 		Expense: 2000,
// 		Income: 9800
// 	},
// 	{
// 		name: 'Apr',
// 		Expense: 2780,
// 		Income: 3908
// 	},
// 	{
// 		name: 'May',
// 		Expense: 1890,
// 		Income: 4800
// 	},
// 	{
// 		name: 'Jun',
// 		Expense: 2390,
// 		Income: 3800
// 	},
// 	{
// 		name: 'July',
// 		Expense: 3490,
// 		Income: 4300
// 	},
// 	{
// 		name: 'Aug',
// 		Expense: 2000,
// 		Income: 9800
// 	},
// 	{
// 		name: 'Sep',
// 		Expense: 2780,
// 		Income: 3908
// 	},
// 	{
// 		name: 'Oct',
// 		Expense: 1890,
// 		Income: 4800
// 	},
// 	{
// 		name: 'Nov',
// 		Expense: 2390,
// 		Income: 3800
// 	},
// 	{
// 		name: 'Dec',
// 		Expense: 3490,
// 		Income: 4300
// 	}
// ]

export default function TransactionChart() {
  const dispatch = useDispatch();
  const { data, error } = useSelector((state) => state.billReducer);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getRevenue(selectedYear));
  }, [dispatch, selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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

  return (
    <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-3">
        <strong className="text-gray-700 font-medium">Transactions</strong>
        <select
          className="border border-gray-300 rounded-sm p-1 text-sm"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {generateYearOptions()}
        </select>
      </div>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
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
