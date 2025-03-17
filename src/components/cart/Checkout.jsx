import { Button, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useCart from "../../hook/useCart";
import { getUserProfile } from "../State/Authentication/Action";
import { getChoicesByOptionalId } from "../State/Choice/Action";
import { getOptionals } from "../State/Optional/Action";
import socket from "../config/socket";
import { useCartContext } from "./CartContext";
import MapComponent from './MapComponent';
const Checkout = () => {
  const jwt = localStorage.getItem("jwt");
  const { cart, totalQuantity, totalPrice, handleRemove } = useCart(jwt);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressMethod, setAddressMethod] = useState("manual");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clearCart } = useCartContext();
  const { state } = useLocation();

  const {
    discount,
    voucherId,
    finalTotal,
    pointsUsed,
  } = state || JSON.parse(localStorage.getItem("checkoutData")) || {};

  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [isPositionLoaded, setIsPositionLoaded] = useState(false);
  const LOCATIONIQ_API_KEY = "pk.2b0fee32045c1896341b402c43932395"; 

  useEffect(() => {
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
    handleUseCurrentLocation();
  }, [dispatch]);

  useEffect(() => {
    if (addressMethod == 'map') handleUseCurrentLocation();
    else setFormData((prev) => ({ ...prev, address: "" }));
  }, [addressMethod]);

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
          window.location.href = response.data.paymentLink;
        } else {
          alert("Không thể tạo liên kết thanh toán.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo liên kết thanh toán:", error);
        alert("Đã xảy ra lỗi khi tạo liên kết thanh toán.");
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          console.log('isPositionLoaded', isPositionLoaded);
          console.log('addressMethod', addressMethod);
          if(isPositionLoaded || addressMethod == 'map') {
            getAddressFromCoords(latitude, longitude);
          }
          setIsPositionLoaded(true);
        },
        async (error) => {
          console.error("Geolocation error:", error);
          alert("Không thể lấy vị trí từ trình duyệt. Thử lấy từ IP...");
          try {
            const response = await axios.get("https://ipapi.co/json/");
            const { latitude, longitude } = response.data;
            setPosition([latitude, longitude]);
            setIsPositionLoaded(true);
          } catch (ipError) {
            console.error("IP geolocation error:", ipError);
            alert("Không thể lấy vị trí. Sử dụng vị trí mặc định.");
            setPosition([21.0285, 105.8542]); 
            setIsPositionLoaded(true);
          }
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị. Thử lấy từ IP...");
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const { latitude, longitude } = response.data;
        setPosition([latitude, longitude]);
        setIsPositionLoaded(true);
      } catch (ipError) {
        console.error("IP geolocation error:", ipError);
        alert("Không thể lấy vị trí. Sử dụng vị trí mặc định.");
        setPosition([21.0285, 105.8542]);
        setIsPositionLoaded(true);
      }
    }
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;
      console.log("Requesting address from:", url);
      const response = await axios.get(url);
      console.log("LocationIQ response:", response.data);
      const address = response.data.display_name;
      setFormData((prev) => ({ ...prev, address }));
      //setShowMap(false);
    } catch (error) {
      console.error("Error fetching address:", error.response || error.message);
      alert("Không thể lấy địa chỉ từ vị trí này. Kiểm tra console để debug.");
    }
  };

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, address: value }));

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${value}&limit=5&countrycodes=vn`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, address: suggestion.display_name }));
    setSuggestions([]);
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
              id="phone"
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.phone}
              style={{ marginBottom: "16px" }}
            />
            <div className="mb-4">
              <label className="text-lg font-semibold mb-2 block">
                Chọn cách nhập địa chỉ
              </label>
              <RadioGroup
                value={addressMethod}
                onChange={(e) => {
                  setAddressMethod(e.target.value);
                  if (e.target.value === "map") {
                    setShowMap(true);
                    if (!isPositionLoaded) {
                      handleUseCurrentLocation();
                    }
                  } else {
                    setShowMap(false);
                  }
                }}
              >
                <FormControlLabel
                  value="manual"
                  control={<Radio />}
                  label="Nhập địa chỉ thủ công"
                />
                <FormControlLabel
                  value="map"
                  control={<Radio />}
                  label="Chọn từ bản đồ"
                />
              </RadioGroup>
            </div>
            {showMap && (
              <MapComponent
                position={position}
                setPosition={setPosition}
                setAddress={getAddressFromCoords}
              />
            )}

            <div style={{ position: "relative" }}>
              <TextField
                fullWidth
                required
                id="address"
                name="address"
                label="Địa chỉ"
                variant="outlined"
                onChange={handleAddressChange}
                value={formData.address}
                style={{ marginBottom: "16px" }}
              />
              {suggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 1000,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
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
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Thanh toán khi nhận hàng"
                  sx={{ margin: 0 }}
                />
                <FormControlLabel
                  value="online"
                  control={<Radio />}
                  label="Thanh toán online"
                  sx={{ margin: 0 }}
                />
              </RadioGroup>
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
