import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductSale } from "../../components/State/Bill/Action";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function RecentOrders() {
  const dispatch = useDispatch();
  const { productSales, error } = useSelector((state) => state.billReducer);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    dispatch(getProductSale(startDate, endDate));
  }, [dispatch, startDate, endDate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      productSales.map((product, index) => ({
        ID: index + 1,
        "Product Name": product.name,
        Quantity: product.quantity,
        Price: product.price,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Sales");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "product_sales.xlsx");
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate <= today) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate <= today && (!startDate || selectedDate >= startDate)) {
      setEndDate(selectedDate);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <div className="flex justify-between items-center mb-3">
        <strong className="text-gray-700 text-xl font-medium">Top sản phẩm bán chạy</strong>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            max={today}
            className="border border-gray-300 rounded-md p-2 text-gray-700"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || undefined}
            max={today}
            className="border border-gray-300 rounded-md p-2 text-gray-700"
            placeholder="End Date"
          />
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Xuất Excel
          </button>
        </div>
      </div>
      <div className="border-x border-gray-200 rounded-sm mt-3">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-left">Tên sản phẩm</th>
              <th className="">Hình ảnh</th>
              <th className="text-center">Số lượng đã bán</th>
              <th className="text-center">Giá</th>
            </tr>
          </thead>
          <tbody>
            {productSales?.map((product, index) => (
              <tr key={product.id}>
                <td width={120} className="text-center">{index + 1}</td>
                <td className="text-left">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </td>
                <td className="text-center">
                  <div className="flex justify-center items-center">
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                </td>
                <td className="text-center">{product.quantity}</td>
                <td className="text-center">{product.price.toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
