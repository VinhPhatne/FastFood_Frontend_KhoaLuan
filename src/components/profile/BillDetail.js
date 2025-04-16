import { Box, Button, TextField, Typography, Modal, Rating, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBillById } from "../../components/State/Bill/Action";
import { useNavigate, useParams } from "react-router-dom";
import { getVoucherById } from "../../components/State/voucher/Action";
import useCart from '../../hook/useCart';
import { notification } from 'antd';
import socket from "../config/socket";

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const BillDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [billData, setBillData] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const { addToCart, cart, setCart } = useCart();

  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [salutation, setSalutation] = useState("Anh");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getBillById({ id, jwt }));
      setBillData(response.data);

      if (response.data?.voucher) {
        const voucherResponse = await dispatch(
          getVoucherById({ id: response.data?.voucher, jwt })
        );
        if (voucherResponse) {
          setVoucherDiscount(voucherResponse.data?.discount);
        }
      }
    };

    fetchData();

    socket.on("order_status_updated", (data) => {
      if (data.billId === id) {
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

    // Dọn dẹp socket khi component unmount
    return () => {
      socket.off("order_status_updated");
    };
  }, [dispatch, id, jwt]);

  let totalPrice;

  if (billData) {
    totalPrice = billData.lineItem.reduce((total, item) => {
      const price = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  }

  const totalSubtotal =
    billData?.lineItem?.reduce((total, item) => {
      return total + (item.subtotal || 0);
    }, 0) || 0;

  const handleReorder = () => {
    if (billData?.lineItem) {
      const newItems = billData.lineItem.map((item, index) => {
        const productData = {
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          picture: item.product.picture,
          quantity: item.quantity,
          options: item.options.map((option) => ({
            optionId: option.option._id,
            choiceId: option.choices._id,
            addPrice: option.addPrice,
          })),
          uniqueKey: `${item.product._id}-${index}-${Date.now()}`,
        };
        return productData;
      });

      setCart((prevCart) => {
        let updatedCart = [...prevCart];

        newItems.forEach((newItem) => {
          const existingItemIndex = updatedCart.findIndex(
            (item) => 
              item.id === newItem.id &&
              JSON.stringify(item.options) === JSON.stringify(newItem.options)
          );

          if (existingItemIndex !== -1) {
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + newItem.quantity,
            };
          } else {
            updatedCart.push(newItem);
          }
        });
        return updatedCart;
      });
      notification.success({
        message: "Đặt lại sản phẩm thành công. Sản phẩm đã được thêm vào giỏ hàng!",
      });
    }
  };

  const timelineSteps = [
    { label: "Đơn Hàng Đã Đặt", icon: <AssignmentTurnedInIcon />, state: 1 },
    { label: "Đang Thực Hiện Món", icon: <RestaurantIcon />, state: 2 },
    { label: "Đang Giao Hàng", icon: <LocalShippingIcon />, state: 3 },
    { label: "Giao Hàng Thành Công", icon: <CheckCircleIcon />, state: 4 },
  ];

  const currentStep = billData?.state || 0;

  const handleOpenReview = (item) => {
    setSelectedItem(item);
    setOpenReviewModal(true);
    setFullName(billData?.fullName || "");
    setPhone(billData?.phone_shipment || "");
  };

  const handleCloseReview = () => {
    setOpenReviewModal(false);
    setSelectedItem(null);
    setRating(5);
    setReviewContent("");
    setSalutation("Anh");
    setFullName("");
    setPhone("");
  };

  const handleSubmitReview = async () => {
    if (!rating || !fullName || !phone) {
      notification.error({
        message: "Vui lòng điền đầy đủ thông tin!",
      });
      return;
    }

    const reviewData = {
      phoneNumber: phone,
      fullName: fullName,
      rating: rating,
      comment: reviewContent,
      product: selectedItem.product._id,
    };

    try {
      socket.emit("createReview", reviewData);
      notification.success({
        message: "Đánh giá đã được gửi thành công!",
      });
      handleCloseReview();
    } catch (error) {
      console.error("Error submitting review via socket:", error);
      notification.error({
        message: "Có lỗi xảy ra khi gửi đánh giá!",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        margin: "0px auto",
        marginTop: "120px",
        paddingLeft: "20px",
      }}
    >
      <div className="flex justify-between">
        <h1
          style={{ color: "#ff7d01" }}
          className="text-3xl text-center font-bold mb-6"
        >
          CHI TIẾT HÓA ĐƠN
        </h1>
        <div>
          <Button
            variant="contained"
            style={{
              color: "#fff",
              backgroundColor: "#ff7d01",
              width: "170px",
              marginBottom: "20px",
              marginRight: "20px",
            }}
            onClick={handleReorder}
          >
            Đặt lại sản phẩm
          </Button>
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
      </div>

      <Box sx={{ marginTop: "16px", marginBottom: "16px" }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", marginBottom: "16px" }}
        >
          Trạng thái đơn hàng
        </Typography>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "20px",
              left: "13%",
              right: "13%",
              height: "2px",
              width: "calc(100%-120px)",
              backgroundColor: "#e0e0e0",
              zIndex: -2,
            }}
          />
          {timelineSteps.map((step, index) => (
            <Box key={index} sx={{ textAlign: "center", flex: 1 }}>
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor:
                    step.state <= currentStep ? "#ff7d01" : "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: "#fff",
                }}
              >
                {step.icon}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  marginTop: "8px",
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
                    top: "20px",
                    left: `calc(${index * 25}% + 13%)`,
                    width: "calc(25%)",
                    height: "2px",
                    backgroundColor:
                      step.state < currentStep ? "#ff7d01" : "transparent",
                    zIndex: -1,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <div className="flex justify-between">
        <div className="w-1/2 border rounded-lg p-6 mr-6">
          <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>

          <form>
            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Họ và tên"
              variant="outlined"
              value={billData?.fullName || ""}
              style={{ marginBottom: "16px" }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Địa chỉ"
              variant="outlined"
              value={billData?.address_shipment || ""}
              style={{ marginBottom: "16px" }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              value={billData?.phone_shipment || ""}
              style={{ marginBottom: "16px" }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              id="note"
              name="note"
              label="Ghi chú"
              variant="outlined"
              value={billData?.note || ""}
              style={{ marginBottom: "16px" }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              id="isPaid"
              name="isPaid"
              label="Trạng thái thanh toán"
              variant="outlined"
              value={billData?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              style={{ marginBottom: "16px" }}
              InputProps={{
                readOnly: true,
              }}
            />
          </form>
        </div>

        <div className="w-1/2">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {billData?.lineItem?.length || 0} MÓN
            </h2>

            {billData?.lineItem?.map((item) => (
              <div
                key={item?._id}
                className="flex items-center justify-between border rounded-lg p-4 gap-4 mb-4"
              >
                <img
                  src={item.product.picture}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-md"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">
                    {item?.product?.name}
                  </h2>
                  <span className="text-sm">Số lượng: {item?.quantity}</span>
                  <p className="text-sm">
                    Thành tiền:{" "}
                    {(item?.product?.price * item?.quantity).toLocaleString()} đ
                  </p>
                </div>
                <div>
                  <StarIcon
                    onClick={() => currentStep === 4 && handleOpenReview(item)}
                    sx={{
                      color: currentStep === 4 ? "#ff7d01" : "#e0e0e0",
                      cursor: currentStep === 4 ? "pointer" : "not-allowed",
                      fontSize: 30,
                    }}
                  />
                </div>
              </div>
            ))}

            {billData?.lineItem?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{totalSubtotal.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{billData?.ship?.toLocaleString()} đ</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Giảm giá Voucher</span>
                    <span>-{voucherDiscount.toLocaleString()} đ</span>
                  </div>
                )}
                {billData?.pointDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Giảm giá Điểm</span>
                    <span>-{billData.pointDiscount.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl">
                  <span>Tổng thanh toán </span>
                  <span>{billData?.total_price?.toLocaleString()} đ</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={openReviewModal}
        onClose={handleCloseReview}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="review-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Đánh giá
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            label="Mời đánh giá về sản phẩm"
            multiline
            rows={3}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              row
              name="salutation"
              value={salutation}
              onChange={(e) => setSalutation(e.target.value)}
            >
              <FormControlLabel value="Anh" control={<Radio />} label="Anh" />
              <FormControlLabel value="Chị" control={<Radio />} label="Chị" />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            label="Họ và tên *"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Số điện thoại *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "rgb(255, 125, 1)",
              "&:hover": { backgroundColor: "rgb(255, 125, 1)" },
              width: "100%",
            }}
            onClick={handleSubmitReview}
          >
            Gửi đánh giá
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BillDetail;