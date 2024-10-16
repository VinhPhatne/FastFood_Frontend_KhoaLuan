import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBillById } from "../../components/State/Bill/Action";
import { useParams } from "react-router-dom";

const BillDetailTable = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getBillById({ id, jwt }));
      setBillData(response.data);
    };

    fetchData();
  }, [dispatch, id, jwt]);

  console.log("billData", billData);

  let totalPrice;

  if (billData) {
    totalPrice = billData.lineItem.reduce((total, item) => {
      const price = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  }

  return (
    <Box sx={{ width: "95%", margin: "0px auto", marginTop: "100px" }}>
      <h1 style={{ color: "#ff7d01" }} className="text-3xl font-bold mb-6">
        CHI TIẾT HÓA ĐƠN 
      </h1>
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
                  <p className="text-sm">
                    Thành tiền:{" "}
                    {(item?.product?.price * item?.quantity).toLocaleString()} đ
                  </p>
                </div>
              </div>
            ))}

            {billData?.lineItem?.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{totalPrice} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{billData?.ship?.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                  <span>Tổng thanh toán </span>
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
