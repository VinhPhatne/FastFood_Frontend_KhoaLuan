import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/"); 
  };

  return (
    <div className="bg-gray-50 h-96 mt-40 flex flex-col items-center justify-center p-8">
      <img
        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
        alt="Success"
        className="w-24 h-24 mb-6"
      />
      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Thanh toán thành công!
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý.
      </p>
      <Button
        variant="contained"
        style={{ backgroundColor: "#ff7d01", color: "#fff" }}
        onClick={handleReturnHome}
      >
        Về trang chủ
      </Button>
    </div>
  );
};

export default PaymentSuccess;
