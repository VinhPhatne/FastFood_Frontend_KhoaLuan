import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateVoucher } from "../../components/State/voucher/Action";
import { notification } from "antd";

const UpdateVoucherForm = ({ voucher, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    code: "",
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        name: voucher.data.name || "",
        discount: voucher.data.discount || "",
        code: voucher.data.code || "",
      });
    }
  }, [voucher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateVoucher({
          id: voucher.data._id,
          code: formData.code,
          name: formData.name,
          discount: formData.discount,
          //expDate: formData.expDate,
          jwt: localStorage.getItem("jwt"),
        })
      );
      onSuccess();
      notification.success({ message: "Cập nhật thành công!" });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Cập nhật thất bại";
      notification.error({ message: errorMessage });    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
        Cập nhật Voucher
      </h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Tên Voucher */}
        <TextField
          fullWidth
          required
          id="name"
          name="name"
          label="Tên Voucher"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
        />

        {/* Giảm giá (Chỉ cho nhập số) */}
        <TextField
          fullWidth
          required
          id="discount"
          name="discount"
          label="Giảm giá"
          variant="outlined"
          type="number"
          onChange={handleInputChange}
          value={formData.discount}
          inputProps={{ min: 0, max: 1000000000 }}
        />

        {/* Mã Voucher */}
        <TextField
          fullWidth
          required
          id="code"
          name="code"
          label="Code"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.code}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          style={{ color: "#fff", backgroundColor: "#ff7d01" }}
        >
          Cập nhật
        </Button>
      </form>
    </div>
  );
};

export default UpdateVoucherForm;
