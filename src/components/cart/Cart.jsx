import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jwt = localStorage.getItem("jwt");
  const [cart, setCart] = useState([]);

  const [voucher, setVoucher] = useState(""); // State cho mã voucher
  const [discount, setDiscount] = useState(0); // State cho tiền giảm giá
  const [voucherError, setVoucherError] = useState(""); // State cho lỗi nếu có
  const [voucherId, setVoucherId] = useState(null);
  const [pointsUsed, setPointsUsed] = useState(0); // State để nhập điểm
  const [pointsError, setPointsError] = useState(""); // State để thông báo lỗi

  useEffect(() => {
    const savedCart = JSON.parse(Cookies.get(jwt) || "[]");
    setCart(savedCart);
  }, [jwt]);

  useEffect(() => {
    if (jwt) {
      dispatch(getUserProfile());
    }
  }, [dispatch, jwt]);

  const userProfile = useSelector((state) => state.auth.user);
  const userPoints = userProfile.point;

  console.log("userPoints", userPoints);

  const handleIncrease = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    Cookies.set(jwt, JSON.stringify(updatedCart), { expires: 2 });
  };

  const handleDecrease = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    Cookies.set(jwt, JSON.stringify(updatedCart), { expires: 2 });
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    Cookies.set(jwt, JSON.stringify(updatedCart), { expires: 2 });
  };

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingFee = totalPrice > 0 ? 10000 : 0;
  const finalTotal = Math.max(
    totalPrice + shippingFee - discount - pointsUsed,
    0
  );

  const handleApplyVoucher = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/v1/voucher/getcode?code=${voucher}`
      );
      console.log("response", response);
      if (response.data && response.data.data) {
        setDiscount(response.data.data.discount);
        setVoucherId(response.data.data._id);
        setVoucherError("");
      } else {
        setVoucherError("Mã giảm giá không hợp lệ");
        setDiscount(0);
        setVoucherId(null);
      }
    } catch (error) {
      setVoucherError("Có lỗi xảy ra khi áp dụng mã giảm giá");
      console.error(error);
    }
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value > userPoints) {
      setPointsError("Số điểm nhập vượt quá số điểm bạn đang có");
      setPointsUsed(0);
    } else {
      setPointsError("");
      setPointsUsed(value);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        discount,
        voucherId,
        pointsUsed,
        finalTotal,
      },
    });
  };

  return (
    <div class="container mx-auto p-8 mt-24 mb-12">
      <h1 style={{ color: "#ff7d01" }} class="text-3xl font-bold mb-6">
        GIỎ HÀNG CỦA TÔI
      </h1>

      <div className="flex items-start justify-between">
        <div
          className="flex flex-col justify-start gap-6 md:grid-cols-2"
          style={{ width: "760px", height: "200px" }}
        >
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center border rounded-lg p-4 gap-4"
              >
                <img
                  src={item.picture}
                  alt={item.name}
                  className="w-24 h-24 rounded-md"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="w-8 h-8 border rounded-full flex justify-center items-center"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="w-8 h-8 border rounded-full flex justify-center items-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-lg font-semibold">
                  {item.price * item.quantity} đ
                </span>
              </div>
            ))
          ) : (
            <p>Giỏ hàng trống</p>
          )}
        </div>

        {cart.length > 0 && (
          <div className="md:w-1/3 md:ml-auto">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{totalQuantity} MÓN</h2>
              <div className="mb-4">
                <p>Bạn có Mã giảm giá?</p>
                <input
                  type="text"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  placeholder="Mã giảm giá *"
                  className="w-full border rounded px-4 py-2 mt-2"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                  Áp dụng
                </button>
                {voucherError && (
                  <p className="text-red-500 mt-2">{voucherError}</p>
                )}
              </div>

              <div className="mb-4">
                <p>Dùng điểm thưởng</p>
                <input
                  type="number"
                  value={pointsUsed}
                  onChange={handlePointsChange}
                  placeholder={`Bạn có ${userPoints} điểm`}
                  className="w-full border rounded px-4 py-2 mt-2"
                />
                {pointsError && (
                  <p className="text-red-500 mt-2">{pointsError}</p>
                )}
              </div>

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
                  <div className="flex justify-between text-green-600">
                    <span>Điểm đã dùng</span>
                    <span>-{pointsUsed.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Tổng thanh toán</span>
                  <span>{finalTotal.toLocaleString()} đ</span>
                </div>
              </div>

              <button
                className="mt-6 w-full text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
                style={{ backgroundColor: "#ff7d01" }}
                onClick={handleCheckout}
              >
                Thanh toán {finalTotal.toLocaleString()} đ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
