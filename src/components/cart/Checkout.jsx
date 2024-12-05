import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";
import { createBill } from "../State/Bill/Action";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useCart from "../../hook/useCart";
import { useCartContext } from "./CartContext";
import { getOptionals } from "../State/Optional/Action";
import { getChoicesByOptionalId } from "../State/Choice/Action";
import socket from "../config/socket";
import axios from "axios";
const Checkout = () => {
  const jwt = localStorage.getItem("jwt");
  const {
    cart,
    totalQuantity,
    totalPrice,
    handleIncrease,
    handleDecrease,
    handleRemove,
  } = useCart(jwt);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clearCart } = useCartContext();

  const { state } = useLocation();
  //const { discount, voucherId, finalTotal, pointsUsed } = state || {};
  const {
    discount,
    voucherId,
    finalTotal,
    pointsUsed,
  } = state || JSON.parse(localStorage.getItem("checkoutData")) || {};

  useEffect(() => {
    // Lưu dữ liệu vào localStorage khi vào trang
    if (state) {
      localStorage.setItem("checkoutData", JSON.stringify(state));
    }
  }, [state]);
  const [serverResponse, setServerResponse] = useState(null);

  const userProfile = useSelector((state) => state.auth.user);
  const { optionals } = useSelector((state) => state.optionalReducer.optionals);
  const [choices, setChoices] = useState({});

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getOptionals({ jwt }));
  }, [dispatch]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server via WebSocket");
    });

    socket.on("billCreated", (response) => {
      console.log("Server response:", response);
      setServerResponse(response);
      if (response.status === "success") {
        clearCart();
        navigate("/success");
      } else {
        alert("Error creating bill");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("billCreated");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const billData = {
      fullName: formData.fullName,
      address_shipment: formData.address,
      phone_shipment: formData.phone,
      ship: shippingFee,
      total_price: finalTotal,
      pointDiscount: pointsUsed,
      //isPaid: false,
      isPaid: paymentMethod === "online",
      voucher: voucherId,
      lineItems: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        options: item.options.map((option) => ({
          optionId: option.optionId,
          choiceId: option.choiceId,
          addPrice: option.addPrice,
        })),
      })),
      note: formData.note || "",
      //account: userProfile?._id ? userProfile?._id : {},
    };
    if (userProfile?._id) {
      billData.account = userProfile._id;
    }
    //socket.emit("createBill", billData);

    if (paymentMethod === "cod") {
      socket.emit("createBill", billData);
    } else if (paymentMethod === "online") {
      try {
        localStorage.setItem("pendingBillData", JSON.stringify(billData));
        const response = await axios.post(
          "http://localhost:8080/create-payment-link",
          {
            amount: finalTotal,
            returnUrl: "http://localhost:3000/success",
            cancelUrl: "http://localhost:3000/checkout",
          }
        );

        if (response.data && response.data.paymentLink) {
          window.location.href = response.data.paymentLink; // Chuyển hướng đến trang thanh toán
        } else {
          alert("Không thể tạo liên kết thanh toán.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo liên kết thanh toán:", error);
        alert("Đã xảy ra lỗi khi tạo liên kết thanh toán.");
      }
    }
  };

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

  const shippingFee = totalPrice > 0 ? 10000 : 0;
  const totalPrice1 = cart.reduce((acc, item) => {
    const totalAddPrice = item.options.reduce(
      (optionAcc, opt) => optionAcc + (opt.addPrice || 0),
      0
    );
    return acc + (item.price + totalAddPrice) * item.quantity;
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getOptionName = async (optionalId) => {
    if (!optionals || optionals.length === 0) {
      return "Không tìm thấy tên tùy chọn";
    }
    const option = optionals.find((opt) => opt._id === optionalId);

    dispatch(getChoicesByOptionalId({ optionalId, jwt }))
      .then((response) => {
        console.log("response", response);
        setChoices((prevChoices) => ({
          ...prevChoices,
          [optionalId]: response,
        }));
      })
      .catch((error) => {
        console.error("Error setting choices:", error);
      });

    console.log("Choices123", choices);

    return option ? option.name : "";
  };

  const getChoiceName = (optionalId, choiceId) => {
    const choiceList = choices[optionalId];
    if (!choiceList || choiceList.length === 0) {
      return "";
    }
    const choice = choiceList.find((ch) => ch._id === choiceId);
    return choice ? choice.name : "Không có tên lựa chọn";
  };

  useEffect(() => {
    const fetchOptionNames = async () => {
      const names = {};
      for (const item of cart) {
        for (const opt of item.options) {
          names[opt.optionId] = await getOptionName(opt.optionId);
        }
      }
    };

    if (cart.length > 0) {
      fetchOptionNames();
    }
  }, [cart, optionals]);

  return (
    <div className="container mx-auto p-8 mt-24 mb-12 flex flex-col">
      <div className="flex justify-between">
        <h1 style={{ color: "#ff7d01" }} className="text-3xl font-bold mb-6">
          THANH TOÁN
        </h1>
        <Button
          variant="contained"
          style={{
            color: "#fff",
            backgroundColor: "#ff7d01",
            width: "100px",
            marginBottom: "20px",
          }}
          onClick={() => navigate(-1)}
        >
          Quay về
        </Button>
      </div>

      <div className="flex justify-between">
        {/* Form thông tin người dùng */}
        <div className="w-1/2 border rounded-lg p-6 mr-6">
          <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
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
              required
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
              required
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

            {/* Radio chọn phương thức thanh toán */}
            <div className="mb-6">
              <label className="text-lg font-semibold mb-2 block">
                Phương thức thanh toán
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="cod">Thanh toán khi nhận hàng</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="online"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="online">Thanh toán online</label>
              </div>
            </div>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              style={{ color: "#fff", backgroundColor: "#ff7d01" }}
            >
              Thanh toán {finalTotal ? finalTotal.toLocaleString() : "0"} đ
            </Button>
          </form>
        </div>

        {/* Hiển thị giỏ hàng */}
        <div className="w-1/2">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{totalQuantity} MÓN</h2>

            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-4 gap-4 mb-4"
                >
                  <img
                    src={item.picture}
                    alt={item.name}
                    className="w-16 h-16 rounded-md"
                  />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      x {item.quantity}
                    </button>
                    {/* Hiển thị options */}
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {item.options.map((option) => (
                          <div
                            key={option.optionId}
                            className="flex justify-between"
                          >
                            {getChoiceName(option.optionId, option.choiceId) ||
                              ""}
                            {option.addPrice
                              ? ` (+${option.addPrice.toLocaleString()} đ)`
                              : ""}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-lg font-semibold">
                    {(
                      item.price * item.quantity +
                      item.options.reduce(
                        (acc, option) =>
                          acc +
                          (option.addPrice
                            ? option.addPrice * item.quantity
                            : 0),
                        0
                      )
                    ).toLocaleString()}{" "}
                    đ
                  </span>
                </div>
              ))
            ) : (
              <p>Giỏ hàng trống</p>
            )}

            {cart.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{totalPrice1.toLocaleString()} đ</span>
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
                  <span>{finalTotal ? finalTotal.toLocaleString() : "0"}  đ</span>
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
