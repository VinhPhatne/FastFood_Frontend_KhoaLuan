import { Button, FormControlLabel, Radio, RadioGroup, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useCart from "../../hook/useCart";
import { getUserProfile } from "../State/Authentication/Action";
import { getChoicesByOptionalId } from "../State/Choice/Action";
import { getOptionals } from "../State/Optional/Action";
import socket from "../config/socket";
import { useCartContext } from "./CartContext";
import { notification } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Checkout = () => {
  const jwt = localStorage.getItem("jwt");
  const { cart, totalQuantity, totalPrice, handleRemove } = useCart(jwt);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    note: "",
    districtId: "",
    wardCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clearCart } = useCartContext();
  const { state } = useLocation();

  const {
    discount,
    voucherId,
    finalTotal: initialFinalTotal,
    pointsUsed,
  } = state || JSON.parse(localStorage.getItem("checkoutData")) || {};

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [route, setRoute] = useState(null);

  const GHN_API_TOKEN = "2d698e94-2c17-11f0-a0cd-12f647571c0a";
  const GHN_SHOP_ID = "5767786";
  const GHN_API_BASE_URL = "https://online-gateway.ghn.vn";
  const STORE_LOCATION = {
    districtId: 1452, // Thành phố Thủ Đức
    wardCode: "21012", // Phường Linh Chiểu
    lat: 10.850317, // Tọa độ 1 Võ Văn Ngân
    lng: 106.772936,
  };

  const mapRef = useRef(null);

  useEffect(() => {
    if (state) {
      localStorage.setItem("checkoutData", JSON.stringify(state));
    }
  }, [state]);

  const userProfile = useSelector((state) => state.auth.user);
  const { optionals } = useSelector((state) => state.optionalReducer.optionals);
  const [choices, setChoices] = useState({});

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getOptionals({ jwt }));
    if (!GHN_API_TOKEN || GHN_API_TOKEN === "your-ghn-api-token-here") {
      notification.error({
        message: "Lỗi cấu hình",
        description: "Vui lòng cập nhật GHN_API_TOKEN hợp lệ trong mã nguồn",
      });
    } else if (!GHN_SHOP_ID || GHN_SHOP_ID === "your-shop-id-here") {
      notification.error({
        message: "Lỗi cấu hình",
        description: "Vui lòng cập nhật GHN_SHOP_ID hợp lệ trong mã nguồn",
      });
    } else {
      fetchDistricts();
    }
  }, [dispatch]);

  // Lấy danh sách quận/huyện từ GHN
  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${GHN_API_BASE_URL}/shiip/public-api/master-data/district`, {
        headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" },
      });
      if (response.data.code === 200) {
        setDistricts(response.data.data);
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy danh sách quận/huyện");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error.response?.data || error.message);
      notification.error({
        message: "Không thể tải danh sách quận/huyện",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API hoặc kết nối mạng",
      });
    }
  };

  // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(`${GHN_API_BASE_URL}/shiip/public-api/master-data/ward`, {
        headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" },
        params: { district_id: parseInt(districtId) },
      });
      if (response.data.code === 200) {
        setWards(response.data.data);
        console.log("Wards fetched for DistrictID:", districtId, response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy danh sách phường/xã");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error.response?.data || error.message);
      notification.error({
        message: "Không thể tải danh sách phường/xã",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API",
      });
      return [];
    }
  };

  // Lấy danh sách dịch vụ vận chuyển khả dụng
  const fetchAvailableServices = async () => {
    if (!formData.districtId || isNaN(parseInt(formData.districtId))) {
      console.warn("districtId không hợp lệ:", formData.districtId);
      return;
    }

    try {
      console.log("Gọi fetchAvailableServices với districtId:", formData.districtId);
      const response = await axios.post(
        `${GHN_API_BASE_URL}/shiip/public-api/v2/shipping-order/available-services`,
        {
          shop_id: parseInt(GHN_SHOP_ID),
          from_district: STORE_LOCATION.districtId,
          to_district: parseInt(formData.districtId),
        },
        { headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" } }
      );
      if (response.data.code === 200) {
        console.log("Available services:", response.data.data);
        setAvailableServices(response.data.data);
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy dịch vụ vận chuyển");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dịch vụ vận chuyển:", error.response?.data || error.message);
      notification.error({
        message: "Không thể tải danh sách dịch vụ",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API hoặc Shop ID",
      });
    }
  };

  // Tính phí vận chuyển bằng API GHN
  const calculateShippingFee = async () => {
    if (!formData.districtId || !formData.wardCode || availableServices.length === 0) {
      console.warn("Không thể tính phí vận chuyển: Thiếu districtId, wardCode hoặc availableServices", {
        districtId: formData.districtId,
        wardCode: formData.wardCode,
        availableServices,
      });
      return;
    }

    try {
      console.log("Gọi calculateShippingFee với:", {
        districtId: formData.districtId,
        wardCode: formData.wardCode,
        serviceId: availableServices[0]?.service_id,
      });
      const totalWeight = cart.reduce((acc, item) => acc + (item.weight || 1000), 0);
      const response = await axios.post(
        `${GHN_API_BASE_URL}/shiip/public-api/v2/shipping-order/fee`,
        {
          from_district_id: STORE_LOCATION.districtId,
          from_ward_code: STORE_LOCATION.wardCode,
          to_district_id: parseInt(formData.districtId),
          to_ward_code: formData.wardCode,
          service_id: availableServices[0]?.service_id || 53320,
          weight: totalWeight,
          length: 30,
          width: 20,
          height: 20,
          insurance_value: totalPrice,
          items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            weight: item.weight || 1000,
          })),
        },
        {
          headers: {
            Token: GHN_API_TOKEN,
            ShopId: GHN_SHOP_ID,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.code === 200) {
        console.log("Phí vận chuyển:", response.data.data.total);
        setShippingFee(response.data.data.total);
      } else {
        throw new Error(response.data.message || "Lỗi khi tính phí vận chuyển");
      }
    } catch (error) {
      console.error("Lỗi khi tính phí vận chuyển:", error.response?.data || error.message);
      setShippingFee(10000);
      notification.error({
        message: "Không thể tính phí giao hàng",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API hoặc Shop ID",
      });
    }
  };

  // Component để xử lý sự kiện nhấp chuột trên bản đồ
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        console.log("Map clicked:", { lat, lng });
        setSelectedLocation({ lat, lng });

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          if (response.data && response.data.address) {
          console.log('response12345', response);

            const address = response.data.display_name;
            const addressComponents = response.data.address;

            let districtName = addressComponents.suburb || addressComponents.city_district || addressComponents.city || "";
            let wardName = addressComponents.quarter || addressComponents.village || addressComponents.neighbourhood || "";

            console.log("Nominatim response:", { districtName, wardName, addressComponents });

            const districtMapping = {
              "Thủ Đức": "Thành phố Thủ Đức",
              "Thu Duc City": "Thành phố Thủ Đức",
              "Thủ Đức City": "Thành phố Thủ Đức",
              "Ho Chi Minh City": "Thành phố Thủ Đức",
              "District 1": "Quận 1",
              "District 3": "Quận 3",
              "District 4": "Quận 4",
              "District 5": "Quận 5",
              "District 6": "Quận 6",
              "District 7": "Quận 7",
              "District 8": "Quận 8",
              "District 10": "Quận 10",
              "District 11": "Quận 11",
              "Bình Thạnh": "Quận Bình Thạnh",
              "Tân Bình": "Quận Tân Bình",
              "Tân Phú": "Quận Tân Phú",
              "Phú Nhuận": "Quận Phú Nhuận",
              "Gò Vấp": "Quận Gò Vấp",
              "Bình Tân": "Quận Bình Tân",
              "Củ Chi": "Huyện Củ Chi",
              "Hóc Môn": "Huyện Hóc Môn",
              "Bình Chánh": "Huyện Bình Chánh",
              "Nhà Bè": "Huyện Nhà Bè",
              "Cần Giờ": "Huyện Cần Giờ",
            };
            districtName = districtMapping[districtName] || districtName;

            // Chuẩn hóa wardName
            if (wardName && !wardName.toLowerCase().startsWith("phường")) {
              wardName = `Phường ${wardName}`;
            }

            console.log('districtName', districtName);
            console.log('wardName', wardName);
            console.log('districts', districts);

            const matchedDistrict = districts.find(
              (d) => d.DistrictName.toLowerCase().trim() === districtName.toLowerCase().trim()
            );
            if (matchedDistrict) {
              console.log("Matched District:", matchedDistrict);
              const fetchedWards = await fetchWards(matchedDistrict.DistrictID);

              console.log("fetchedWards", fetchedWards);

              const matchedWard = fetchedWards.find(
                (w) => w.WardName.toLowerCase().includes(wardName.toLowerCase())
              );

              

              console.log("Matched Ward:", matchedWard);

              if (matchedWard) {
                setFormData({
                  ...formData,
                  address,
                  districtId: matchedDistrict.DistrictID,
                  wardCode: matchedWard.WardCode,
                });
              } else {
                console.warn("Không tìm thấy phường/xã khớp:", wardName);
                notification.error({
                  message: "Không tìm thấy phường/xã",
                  description: "Vui lòng chọn phường/xã từ danh sách hoặc nhập thủ công",
                });
                setFormData({
                  ...formData,
                  address,
                  districtId: matchedDistrict.DistrictID,
                  wardCode: "",
                });
              }
            } else {
              console.warn("Không tìm thấy quận/huyện khớp:", districtName);
              notification.error({
                message: "Không tìm thấy quận/huyện",
                description: "Vui lòng chọn quận/huyện từ danh sách hoặc nhập thủ công",
              });
              setFormData({
                ...formData,
                address,
                districtId: "",
                wardCode: "",
              });
            }
          } else {
            throw new Error("Không thể lấy địa chỉ từ tọa độ");
          }
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ từ bản đồ:", error);
          notification.error({
            message: "Lỗi bản đồ",
            description: "Không thể lấy địa chỉ. Vui lòng thử lại.",
          });
          setFormData({
            ...formData,
            districtId: "",
            wardCode: "",
          });
        }

        // Vẽ đường đi
        if (mapRef.current) {
          try {
            if (route) {
              mapRef.current.removeControl(route);
            }
            const routingControl = L.Routing.control({
              waypoints: [
                L.latLng(STORE_LOCATION.lat, STORE_LOCATION.lng),
                L.latLng(lat, lng),
              ],
              routeWhileDragging: true,
              show: false,
              lineOptions: {
                styles: [{ color: "#ff7d01", weight: 4 }],
              },
            }).addTo(mapRef.current);

            routingControl.on('routesfound', (e) => {
              console.log("Tuyến đường được tìm thấy:", e.routes[0].summary);
            }).on('routingerror', (e) => {
              console.error("Lỗi định tuyến:", e.error);
              notification.error({
                message: "Lỗi định tuyến",
                description: "Không thể vẽ tuyến đường. Vui lòng thử lại.",
              });
            });

            setRoute(routingControl);
          } catch (error) {
            console.error("Lỗi khi vẽ tuyến đường:", error);
            notification.error({
              message: "Lỗi bản đồ",
              description: "Không thể vẽ tuyến đường. Vui lòng thử lại.",
            });
          }
        }
      },
    });
    return null;
  };

  // Xử lý khi nhập địa chỉ thủ công
  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setFormData({ ...formData, address });

    if (address.length > 5) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&countrycodes=VN&addressdetails=1`
        );
        if (response.data && response.data.length > 0) {
          console.log('response12345', response);
          const { lat, lon, address: addressDetails } = response.data[0];
          setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });

          let districtName = addressDetails.county || addressDetails.city_district || addressDetails.city || "";
          let wardName = addressDetails.suburb || addressDetails.village || addressDetails.neighbourhood || "";

          console.log("Nominatim response (address):", { districtName, wardName, addressDetails });

          const districtMapping = {
            "Thủ Đức": "Thành phố Thủ Đức",
            "Thu Duc City": "Thành phố Thủ Đức",
            "Thủ Đức City": "Thành phố Thủ Đức",
            "Ho Chi Minh City": "Thành phố Thủ Đức",
            "District 1": "Quận 1",
            "District 3": "Quận 3",
            "District 4": "Quận 4",
            "District 5": "Quận 5",
            "District 6": "Quận 6",
            "District 7": "Quận 7",
            "District 8": "Quận 8",
            "District 10": "Quận 10",
            "District 11": "Quận 11",
            "Bình Thạnh": "Quận Bình Thạnh",
            "Tân Bình": "Quận Tân Bình",
            "Tân Phú": "Quận Tân Phú",
            "Phú Nhuận": "Quận Phú Nhuận",
            "Gò Vấp": "Quận Gò Vấp",
            "Bình Tân": "Quận Bình Tân",
            "Củ Chi": "Huyện Củ Chi",
            "Hóc Môn": "Huyện Hóc Môn",
            "Bình Chánh": "Huyện Bình Chánh",
            "Nhà Bè": "Huyện Nhà Bè",
            "Cần Giờ": "Huyện Cần Giờ",
          };
          districtName = districtMapping[districtName] || districtName;

          if (wardName && !wardName.toLowerCase().startsWith("phường")) {
            wardName = `Phường ${wardName}`;
          }

          const matchedDistrict = districts.find(
            (d) => d.DistrictName.toLowerCase().includes(districtName.toLowerCase())
          );
          if (matchedDistrict) {
            const fetchedWards = await fetchWards(matchedDistrict.DistrictID);
            const matchedWard = fetchedWards.find(
              (w) => w.WardName.toLowerCase().includes(wardName.toLowerCase())
            );

            console.log("Matched District (from address):", matchedDistrict);
            console.log("Matched Ward (from address):", matchedWard);

            if (matchedWard) {
              setFormData((prev) => ({
                ...prev,
                districtId: matchedDistrict.DistrictID,
                wardCode: matchedWard.WardCode,
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                districtId: matchedDistrict.DistrictID,
                wardCode: "",
              }));
              notification.error({
                message: "Không tìm thấy phường/xã",
                description: "Vui lòng chọn phường/xã từ danh sách",
              });
            }

            if (mapRef.current) {
              if (route) {
                mapRef.current.removeControl(route);
              }
              const routingControl = L.Routing.control({
                waypoints: [
                  L.latLng(STORE_LOCATION.lat, STORE_LOCATION.lng),
                  L.latLng(parseFloat(lat), parseFloat(lon)),
                ],
                routeWhileDragging: true,
                show: false,
                lineOptions: {
                  styles: [{ color: "#ff7d01", weight: 4 }],
                },
              }).addTo(mapRef.current);

              routingControl.on('routesfound', (e) => {
                console.log("Tuyến đường được tìm thấy (từ địa chỉ):", e.routes[0].summary);
              }).on('routingerror', (e) => {
                console.error("Lỗi định tuyến (từ địa chỉ):", e.error);
                notification.error({
                  message: "Lỗi định tuyến",
                  description: "Không thể vẽ tuyến đường. Vui lòng thử lại.",
                });
              });

              setRoute(routingControl);
            }
          } else {
            console.warn("Không tìm thấy quận/huyện khớp (từ địa chỉ):", districtName);
            notification.error({
              message: "Không tìm thấy quận/huyện",
              description: "Vui lòng chọn quận/huyện từ danh sách",
            });
            setFormData((prev) => ({
              ...prev,
              districtId: "",
              wardCode: "",
            }));
          }
        }
      } catch (error) {
        console.error("Lỗi khi tìm địa chỉ:", error);
        setFormData((prev) => ({
          ...prev,
          districtId: "",
          wardCode: "",
        }));
      }
    }
  };

  useEffect(() => {
    if (formData.districtId && !isNaN(parseInt(formData.districtId))) {
      console.log("useEffect: Gọi fetchWards và fetchAvailableServices với districtId:", formData.districtId);
      fetchWards(formData.districtId);
      fetchAvailableServices();
    } else {
      setWards([]); // Xóa danh sách wards nếu districtId không hợp lệ
      setAvailableServices([]); // Xóa danh sách dịch vụ
      setShippingFee(0); // Đặt lại phí vận chuyển
    }
  }, [formData.districtId]);

  useEffect(() => {
    if (formData.districtId && formData.wardCode && availableServices.length > 0) {
      console.log("useEffect: Gọi calculateShippingFee");
      calculateShippingFee();
    }
  }, [formData.districtId, formData.wardCode, availableServices]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Kết nối với server qua WebSocket");
    });

    socket.on("billCreated", (response) => {
      console.log("Phản hồi từ server:", response);
      if (response.status === "success" && response.data?._id) {
        clearCart();
        navigate(`/success?orderId=${response.data._id}`);
      } else {
        alert("Lỗi khi tạo hóa đơn");
      }
    });

    return () => {
      socket.off("connect");
      socket.off("billCreated");
    };
  }, [navigate, clearCart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalTotal = totalPrice1 + shippingFee - (discount || 0) - (pointsUsed || 0);
    const billData = {
      fullName: formData.fullName,
      address_shipment: `${formData.address}, ${wards.find(w => w.WardCode === formData.wardCode)?.WardName || ''}, ${districts.find(d => d.DistrictID === parseInt(formData.districtId))?.DistrictName || ''}`,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullname || "",
        address: userProfile.address || "",
        phone: userProfile.phonenumber || "",
        note: "",
        districtId: "",
        wardCode: "",
      });
    }
  }, [userProfile]);

  const totalPrice1 = cart.reduce((acc, item) => {
    const totalAddPrice = item.options.reduce(
      (optionAcc, opt) => optionAcc + (opt.addPrice || 0),
      0
    );
    return acc + (item.price + totalAddPrice) * item.quantity;
  }, 0);

  const finalTotal = totalPrice1 + shippingFee - (discount || 0) - (pointsUsed || 0);

  const getOptionName = async (optionalId) => {
    if (!optionals || optionals.length === 0) {
      return "Không tìm thấy tên tùy chọn";
    }
    const option = optionals.find((opt) => opt._id === optionalId);

    dispatch(getChoicesByOptionalId({ optionalId, jwt }))
      .then((response) => {
        setChoices((prevChoices) => ({
          ...prevChoices,
          [optionalId]: response,
        }));
      })
      .catch((error) => {
        console.error("Lỗi khi lấy lựa chọn:", error);
      });

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
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="district-label">Quận/Huyện</InputLabel>
              <Select
                labelId="district-label"
                id="districtId"
                name="districtId"
                value={formData.districtId}
                label="Quận/Huyện"
                onChange={handleInputChange}
              >
                {districts.map((district) => (
                  <MenuItem key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="ward-label">Phường/Xã</InputLabel>
              <Select
                labelId="ward-label"
                id="wardCode"
                name="wardCode"
                value={formData.wardCode}
                label="Phường/Xã"
                onChange={handleInputChange}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              id="address"
              name="address"
              label="Địa chỉ chi tiết"
              variant="outlined"
              value={formData.address}
              onChange={handleAddressChange}
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Chọn vị trí giao hàng trên bản đồ</h3>
            <MapContainer
              center={[STORE_LOCATION.lat, STORE_LOCATION.lng]}
              zoom={14}
              style={{ height: "400px", width: "100%" }}
              whenCreated={(map) => {
                console.log("Map initialized");
                mapRef.current = map;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[STORE_LOCATION.lat, STORE_LOCATION.lng]}>
                <Popup>Cửa hàng</Popup>
              </Marker>
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>Giao hàng</Popup>
                </Marker>
              )}
              <MapClickHandler />
            </MapContainer>
          </div>
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
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {item.options.map((option) => (
                          <div
                            key={option.optionId}
                            className="flex justify-between"
                          >
                            {getChoiceName(option.optionId, option.choiceId) || ""}
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
                  <span>{finalTotal ? finalTotal.toLocaleString() : "0"} đ</span>
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