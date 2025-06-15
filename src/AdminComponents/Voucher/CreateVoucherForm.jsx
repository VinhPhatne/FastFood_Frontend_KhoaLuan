import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createVoucher } from "../../components/State/voucher/Action";
import { notification } from "antd";

const CreateVoucherForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    code: "",
  });
  const [discountError, setDiscountError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue === "" || parseFloat(numericValue) <= 0) {
        setDiscountError("Giảm giá phải là một số dương");
      } else {
        setDiscountError("");
      }
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDiscountBlur = () => {
    const value = formData.discount;
    if (!value || parseFloat(value) <= 0) {
      setDiscountError("Giảm giá phải là một số dương");
      setFormData({ ...formData, discount: "" });
    } else {
      setDiscountError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (discountError) {
      notification.error({ message: "Vui lòng sửa lỗi giảm giá trước khi thêm mới" });
      return;
    }
    try {
      await dispatch(
        createVoucher({
          code: formData.code,
          name: formData.name,
          discount: parseFloat(formData.discount),
          jwt: localStorage.getItem("jwt"),
        })
      );
      onSuccess();
      notification.success({ message: "Thêm mới thành công!" });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Thêm mới thất bại";
      notification.error({ message: errorMessage });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
        Thêm mới Voucher
      </h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
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
        <TextField
          fullWidth
          required
          id="discount"
          name="discount"
          label="Giảm giá"
          variant="outlined"
          onChange={handleInputChange}
          onBlur={handleDiscountBlur}
          value={formData.discount}
          error={!!discountError}
          helperText={discountError}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
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
          Thêm mới
        </Button>
      </form>
    </div>
  );
};

export default CreateVoucherForm;