import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBillById, updateBillStatus } from "../../components/State/Bill/Action";
import { getVoucherById } from "../../components/State/voucher/Action";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../components/config/socket";
import { notification } from "antd";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BillDetailTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [billData, setBillData] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

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
  }, [dispatch, id, jwt]);

  const timelineSteps = [
    { label: "Đơn Hàng Đã Đặt", icon: <AssignmentTurnedInIcon />, state: 1 },
    { label: "Đang Thực Hiện Món", icon: <RestaurantIcon />, state: 2 },
    { label: "Đang Giao Hàng", icon: <LocalShippingIcon />, state: 3 },
    { label: "Giao Hàng Thành Công", icon: <CheckCircleIcon />, state: 4 },
  ];

  const currentStep = billData?.state || 0;

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateBillStatus(id, newStatus));

      const payload = {
        billId: id,
        state: parseInt(newStatus),
      };
      socket.emit("updateOrderStatus", payload);

      const response = await dispatch(getBillById({ id, jwt }));
      setBillData(response.data);

      notification.success({
        message: "Cập nhật trạng thái đơn hàng thành công!",
      });
    } catch (error) {
      console.error("Error updating bill status:", error);
      notification.error({
        message: "Cập nhật trạng thái thất bại!",
      });
    }
  };

  const handleOpenConfirmModal = (newStatus) => {
    setPendingStatus(newStatus);
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
    setPendingStatus(null);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus && billData?._id) {
      handleStatusChange(billData._id, pendingStatus);
    }
    handleCloseConfirmModal();
  };

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
      const itemTotal = item.subtotal + 
        (item.options ? item.options.reduce((sum, option) => sum + (option.addPrice || 0), 0) : 0);
      return total + itemTotal;
    }, 0) || 0;

  return (
    <Box sx={{ width: "95%", margin: "0px auto", marginTop: "100px" }}>
      <Button
        variant="contained"
        className="float-left"
        style={{ color: "#fff", backgroundColor: "#ff7d01" }}
        onClick={() => navigate(-1)}
      >
        Quay về
      </Button>
      <h1
        style={{ color: "#ff7d01" }}
        className="text-3xl text-center font-bold mb-6"
      >
        CHI TIẾT HÓA ĐƠN
      </h1>

      {/* Thanh tiến trình */}
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
            <Box
              key={index}
              sx={{
                textAlign: "center",
                flex: 1,
                cursor:
                  step.state === currentStep + 1 && currentStep < 4
                    ? "pointer"
                    : "not-allowed",
              }}
               onClick={() => {
                if (step.state === currentStep + 1 && currentStep < 4) {
                  handleOpenConfirmModal(step.state);
                }
              }}
            >
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

      {/* Modal xác nhận */}
      <Modal
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
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
            id="confirm-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Xác nhận cập nhật
          </Typography>
          <Typography id="confirm-modal-description" sx={{ mb: 3 }}>
            Bạn có chắc chắn muốn cập nhật trạng thái cho đơn hàng này?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseConfirmModal}
              sx={{ color: "#ff7d01", borderColor: "#ff7d01" }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmStatusChange}
              sx={{ backgroundColor: "#ff7d01", "&:hover": { backgroundColor: "#e65c00" } }}
            >
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>

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
            <TextField
              fullWidth
              id="state"
              name="state"
              label="Trạng thái đơn hàng"
              variant="outlined"
              value={
                billData?.state === 1
                  ? "Đang xử lý"
                  : billData?.state === 2
                  ? "Đang thực hiện món"
                  : billData?.state === 3
                  ? "Đang giao hàng"
                  : billData?.state === 4
                  ? "Giao hàng thành công"
                  : "Không rõ trạng thái"
              }
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
                  {item.options && item.options.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {item.options.map((option) => (
                        <div
                          key={option.optionId}
                          className="flex justify-between"
                        >
                          {option.choices.name || ""}
                          {option.addPrice
                            ? ` (+${option.addPrice.toLocaleString()} đ)`
                            : ""}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm">
                    Thành tiền: {(
                      item.subtotal +
                      (item.options ? item.options.reduce((sum, option) => sum + (option.addPrice || 0), 0) : 0)
                    ).toLocaleString()} đ
                  </p>
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
                  <span>Tổng thanh toán</span>
                  <span>{billData?.total_price?.toLocaleString()} đ</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default BillDetailTable;
