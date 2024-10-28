import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getOrderStatus } from "./helpers/index";
import { useDispatch, useSelector } from "react-redux";
import { getProductSale } from "../../components/State/Bill/Action";

const recentOrderData = [
  {
    id: "1",
    product_id: "4324",
    customer_id: "23143",
    customer_name: "Shirley A. Lape",
    order_date: "2022-05-17T03:24:00",
    order_total: "$435.50",
    current_order_status: "PLACED",
    shipment_address: "Cottage Grove, OR 97424",
  },
  {
    id: "7",
    product_id: "7453",
    customer_id: "96453",
    customer_name: "Ryan Carroll",
    order_date: "2022-05-14T05:24:00",
    order_total: "$96.35",
    current_order_status: "CONFIRMED",
    shipment_address: "Los Angeles, CA 90017",
  },
  {
    id: "2",
    product_id: "5434",
    customer_id: "65345",
    customer_name: "Mason Nash",
    order_date: "2022-05-17T07:14:00",
    order_total: "$836.44",
    current_order_status: "SHIPPED",
    shipment_address: "Westminster, CA 92683",
  },
  {
    id: "3",
    product_id: "9854",
    customer_id: "87832",
    customer_name: "Luke Parkin",
    order_date: "2022-05-16T12:40:00",
    order_total: "$334.50",
    current_order_status: "SHIPPED",
    shipment_address: "San Mateo, CA 94403",
  },
  {
    id: "4",
    product_id: "8763",
    customer_id: "09832",
    customer_name: "Anthony Fry",
    order_date: "2022-05-14T03:24:00",
    order_total: "$876.00",
    current_order_status: "OUT_FOR_DELIVERY",
    shipment_address: "San Mateo, CA 94403",
  },
  {
    id: "5",
    product_id: "5627",
    customer_id: "97632",
    customer_name: "Ryan Carroll",
    order_date: "2022-05-14T05:24:00",
    order_total: "$96.35",
    current_order_status: "DELIVERED",
    shipment_address: "Los Angeles, CA 90017",
  },
];

export default function RecentOrders() {
  const dispatch = useDispatch();
  const { productSales, error } = useSelector((state) => state.billReducer);
  useEffect(() => {
    dispatch(getProductSale());
  }, [dispatch]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Recent Orders</strong>
      <div className="border-x border-gray-200 rounded-sm mt-3">
        <table className="w-full text-gray-700">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-left">Product Name</th>
              <th className="">Image</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Price</th>
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
                <td className="text-center">{product.price} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
