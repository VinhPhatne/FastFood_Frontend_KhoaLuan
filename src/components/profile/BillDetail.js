import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBillById } from "../../components/State/Bill/Action";
import { useNavigate, useParams } from "react-router-dom";
import { getVoucherById } from "../../components/State/voucher/Action";
import useCart from '../../hook/useCart';
import { notification } from 'antd';

const BillDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [billData, setBillData] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const { addToCart, cart, setCart } = useCart();
  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getBillById({ id, jwt }));
      setBillData(response.data);

      if (response.data?.voucher) {
        const voucherResponse = await dispatch(
          getVoucherById({ id: response.data?.voucher, jwt })
        );
        console.log("voucherResponse", voucherResponse);
        if (voucherResponse) {
          setVoucherDiscount(voucherResponse.data?.discount);
          console.log("OK");
        }
      }
    };

    fetchData();
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
            options: item.options.map(option => ({
              optionId: option.option._id,
              choiceId: option.choices._id,
              addPrice: option.addPrice
            })),
            uniqueKey: `${item.product._id}-${index}-${Date.now()}`
          };
          return productData;
        });
  
        setCart(prevCart => {
          let updatedCart = [...prevCart];
          
          newItems.forEach(newItem => {
            const existingItemIndex = updatedCart.findIndex(
              item => 
                item.id === newItem.id &&
                JSON.stringify(item.options) === JSON.stringify(newItem.options)
            );
  
            if (existingItemIndex !== -1) {
              updatedCart[existingItemIndex] = {
                ...updatedCart[existingItemIndex],
                quantity: updatedCart[existingItemIndex].quantity + newItem.quantity
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
                marginRight:'20px',
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
    </Box>
  );
};

export default BillDetail;
