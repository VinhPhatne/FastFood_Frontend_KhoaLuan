import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Typography, Card, CardContent, Grid, Fade, Zoom } from "@mui/material";
import socket from "../config/socket";
import { useCartContext } from "./CartContext";
import { notification } from "antd";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getBillById } from '../State/Bill/Action';
import { getVoucherById } from '../State/voucher/Action';
import sound from "../../assets/sounds/sound.mp3";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clearCart } = useCartContext();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const jwt = localStorage.getItem("jwt");
  const [billData, setBillData] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillData = async () => {
      if (!orderId) {
        setError("Không tìm thấy ID đơn hàng.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await dispatch(getBillById({ id: orderId, jwt }));
        setBillData(response.data);

        if (response.data?.voucher) {
          const voucherResponse = await dispatch(
            getVoucherById({ id: response.data.voucher._id, jwt })
          );
          if (voucherResponse) {
            setVoucherDiscount(voucherResponse.data?.discount);
          }
        }
        setIsLoading(false);
      } catch (err) {
        setError("Lỗi khi tải chi tiết đơn hàng.");
        setIsLoading(false);
        console.error("Error fetching bill:", err);
      }
    };

    fetchBillData();
    clearCart();
    localStorage.removeItem("pendingBillData");
    localStorage.removeItem("isOnlinePayment");
    
    socket.on("order_status_updated", (data) => {
      const audio = new Audio(sound);
          audio.load();
          audio.play().catch((error) => {
            console.error("Error playing sound:", error);
          });
      if (data.billId === orderId) {
        setBillData((prev) => ({
          ...prev,
          state: data.newState,
        }));
        notification.success({
          message: "Cập nhật trạng thái",
          description: "Trạng thái đơn hàng đã được cập nhật thành công!",
        });
      }
    });
    localStorage.removeItem("pendingOrderId");

    return () => {
      socket.off("order_status_updated");
    };
  }, [dispatch, orderId, jwt]);

  const timelineSteps = [
    { label: "Đơn Hàng Đã Đặt", icon: <AssignmentTurnedInIcon />, state: 1 },
    { label: "Đang Thực Hiện Món", icon: <RestaurantIcon />, state: 2 },
    { label: "Đang Giao Hàng", icon: <LocalShippingIcon />, state: 3 },
    { label: "Giao Hàng Thành Công", icon: <CheckCircleIcon />, state: 4 },
  ];

  const currentStep = billData?.state || 0;

  const totalSubtotal =
    billData?.lineItem?.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0) || 0;

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    navigate(`/profile/orders/bill/${orderId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#f8f9fa" }}>
        <Typography variant="h6" color="text.secondary">
          Đang tải chi tiết đơn hàng...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#f8f9fa" }}>
        <CheckCircleIcon sx={{ fontSize: 96, color: "#ff7d01", mb: 2 }} />
        <Typography variant="h5" color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: "#ff7d01", "&:hover": { bgcolor: "#e06b00" } }}
          onClick={handleReturnHome}
        >
          Về trang chủ
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 8 }}>
      {/* Phần đầu: Biểu tượng và thông báo thành công */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          mt: 8,
          py: 6,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          mx: "auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Vòng tròn nền động */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            bgcolor: "#ff7d01",
            opacity: 0.1,
            animation: "pulse 2s infinite",
          }}
        />
        <style>
          {`
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
              50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
            }
          `}
        </style>

        {/* Biểu tượng */}
        <Zoom in={true} timeout={500}>
          <Box>
            <CheckCircleIcon
              sx={{
                fontSize: 100,
                color: "#28a745",
                mb: 2,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            />
          </Box>
        </Zoom>

        {/* Tiêu đề */}
        <Fade in={true} timeout={700}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#28a745", mb: 1 }}
          >
            Thanh toán thành công!
          </Typography>
        </Fade>

        {/* Mô tả và mã đơn hàng */}
        <Fade in={true} timeout={900}>
          <Box>
            <Typography
              variant="body1"
              sx={{ color: "#555", mb: 1, maxWidth: "500px", mx: "auto" }}
            >
              Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#777", mb: 4 }}
            >
              Mã đơn hàng: #{orderId}
            </Typography>
          </Box>
        </Fade>

        {/* Nút hành động */}
        <Fade in={true} timeout={1100}>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
           {jwt && <Button
              variant="contained"
              sx={{
                bgcolor: "#ff7d01",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#e06b00" },
              }}
              onClick={handleViewOrder}
            >
              Xem chi tiết đơn hàng
            </Button>}
            <Button
              variant="outlined"
              sx={{
                borderColor: "#ff7d01",
                color: "#ff7d01",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": { borderColor: "#e06b00", color: "#e06b00", bgcolor: "rgba(255,125,1,0.05)" },
              }}
              onClick={handleReturnHome}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Fade>
      </Box>

      {/* Phần giữa: Trạng thái đơn hàng */}
      <Box sx={{ maxWidth: "800px", mx: "auto", mb: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: "#333" }}>
          Trạng thái đơn hàng
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: "20px",
              left: "10%",
              right: "10%",
              height: "4px",
              bgcolor: "#e0e0e0",
              zIndex: -1,
            }}
          />
          {timelineSteps.map((step, index) => (
            <Box key={index} sx={{ textAlign: "center", flex: 1 }}>
              <Box
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  bgcolor: step.state <= currentStep ? "#ff7d01" : "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  color: "#fff",
                  boxShadow: step.state <= currentStep ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                {step.icon}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: step.state <= currentStep ? "#ff7d01" : "#757575",
                  fontWeight: step.state <= currentStep ? "bold" : "normal",
                }}
              >
                {step.label}
              </Typography>
              {index < timelineSteps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "22px",
                    left: `calc(${index * 25}% + 15%)`,
                    width: "calc(25% - 10px)",
                    height: "4px",
                    bgcolor: step.state < currentStep ? "#ff7d01" : "transparent",
                    zIndex: 5,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Phần dưới: Chi tiết đơn hàng */}
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#ff7d01" }}>
              Chi tiết đơn hàng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Thông tin giao hàng
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Họ và tên
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {billData?.fullName || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Số điện thoại
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {billData?.phone_shipment || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Địa chỉ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {billData?.address_shipment || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {billData?.lineItem?.length || 0} món
            </Typography>
            {billData?.lineItem?.map((item) => (
              <Box
                key={item?._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: '20px',
                  py: 2,
                  borderBottom: billData?.lineItem?.length > 1 ? "1px solid #e0e0e0" : "none",
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                <img
                  src={item.product.picture}
                  alt={item.product.name}
                  style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item?.product?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số lượng: {item?.quantity}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {(item?.product?.price * item?.quantity).toLocaleString()} đ
                </Typography>
              </Box>
            ))}
            {billData?.lineItem?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1">Tổng đơn hàng</Typography>
                  <Typography variant="body1">{totalSubtotal.toLocaleString()} đ</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1">Phí giao hàng</Typography>
                  <Typography variant="body1">{billData?.ship?.toLocaleString()} đ</Typography>
                </Box>
                {voucherDiscount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: "#28a745" }}>
                    <Typography variant="body1">Giảm giá Voucher</Typography>
                    <Typography variant="body1">-{voucherDiscount.toLocaleString()} đ</Typography>
                  </Box>
                )}
                {billData?.pointDiscount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: "#28a745" }}>
                    <Typography variant="body1">Giảm giá Điểm</Typography>
                    <Typography variant="body1">-{billData.pointDiscount.toLocaleString()} đ</Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, fontWeight: "bold", fontSize: "1.25rem" }}>
                  <Typography variant="h6">Tổng thanh toán</Typography>
                  <Typography variant="h6">{billData?.total_price?.toLocaleString()} đ</Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;