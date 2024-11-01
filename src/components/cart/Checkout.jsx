import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";
import { createBill } from "../State/Bill/Action";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useCart from "../card/useCart";

const Checkout = () => {
  const jwt = localStorage.getItem("jwt");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    note: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { discount, voucherId, finalTotal, pointsUsed } = state || {};
  const { cart, totalQuantity, totalPrice, handleIncrease, handleDecrease, handleRemove } = useCart(jwt);
  const userProfile = useSelector((state) => state.auth.user);
  const shippingFee = totalPrice > 0 ? 10000 : 0;

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullname || "",
        address: userProfile.address || "",
        phone: userProfile.phonenumber || "",
        note: "",
      });
    }
  }, [userProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const billData = {
      fullName: formData.fullName,
      address_shipment: formData.address,
      phone_shipment: formData.phone,
      ship: shippingFee,
      total_price: finalTotal,
      pointDiscount: pointsUsed,
      isPaid: false,
      voucher: voucherId,
      lineItems: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      note: formData.note || "",
      account: userProfile._id,
    };

    dispatch(createBill(billData)).then(() => {
      Cookies.remove(jwt);
      dispatch(getUserProfile());
      navigate("/success");
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto p-8 mt-24 mb-12">
      <h1 style={{ color: "#ff7d01" }} className="text-3xl font-bold mb-6">
        THANH TOÁN
      </h1>

      <div className="flex justify-between">
        <div className="w-1/2 border rounded-lg p-6 mr-6">
          <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Họ và tên"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.fullName}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Địa chỉ"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.address}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.phone}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              fullWidth
              id="note"
              name="note"
              label="Ghi chú"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.note}
              style={{ marginBottom: "16px" }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              style={{ color: "#fff", backgroundColor: "#ff7d01" }}
            >
              Thanh toán {finalTotal.toLocaleString()} đ
            </Button>
          </form>
        </div>

        <div className="w-1/2">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{totalQuantity} MÓN</h2>

            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-4 gap-4 mb-4"
                >
                  <img src={item.picture} alt={item.name} className="w-16 h-16 rounded-md" />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">

                    <span className="text-lg font-semibold mx-10">x {item.quantity}</span>
                  </div>
                  <span className="text-lg font-semibold">{(item.price * item.quantity).toLocaleString()} đ</span>
                </div>
              ))
            ) : (
              <p>Giỏ hàng trống</p>
            )}

            {cart.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{totalPrice.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{shippingFee.toLocaleString()} đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()} đ</span>
                  </div>
                )}
                {pointsUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Điểm đã dùng</span>
                    <span>-{pointsUsed.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl">
                  <span>Tổng thanh toán</span>
                  <span>{finalTotal.toLocaleString()} đ</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
