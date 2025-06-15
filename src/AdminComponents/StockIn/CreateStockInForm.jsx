import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createIngredient } from "../../components/State/Import/Action";
import { notification } from "antd";

const CreateStockInForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    quantity: "",
    price: "",
  });
  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" || name === "price") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue === "" || parseFloat(numericValue) <= 0) {
        if (name === "quantity") {
          setQuantityError("Số lượng phải là một số dương");
        } else {
          setPriceError("Giá phải là một số dương");
        }
      } else {
        if (name === "quantity") {
          setQuantityError("");
        } else {
          setPriceError("");
        }
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

  const handleQuantityBlur = () => {
    const value = formData.quantity;
    if (!value || parseFloat(value) <= 0) {
      setQuantityError("Số lượng phải là một số dương");
      setFormData({ ...formData, quantity: "" });
    } else {
      setQuantityError("");
    }
  };

  const handlePriceBlur = () => {
    const value = formData.price;
    if (!value || parseFloat(value) <= 0) {
      setPriceError("Giá phải là một số dương");
      setFormData({ ...formData, price: "" });
    } else {
      setPriceError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantityError || priceError) {
      notification.error({ message: "Vui lòng sửa lỗi số lượng hoặc giá trước khi thêm mới" });
      return;
    }
    try {
      await dispatch(
        createIngredient({
          name: formData.name,
          unit: formData.unit,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
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
    <div className="">
      <div className="p-5">
        <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
          Thêm mới Nguyên liệu
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Tên sản phẩm"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />
          <TextField
            fullWidth
            id="unit"
            name="unit"
            label="Đơn vị"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.unit}
          />
          <TextField
            fullWidth
            id="quantity"
            name="quantity"
            label="Số lượng"
            variant="outlined"
            onChange={handleInputChange}
            onBlur={handleQuantityBlur}
            value={formData.quantity}
            error={!!quantityError}
            helperText={quantityError}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            fullWidth
            id="price"
            name="price"
            label="Giá"
            variant="outlined"
            onChange={handleInputChange}
            onBlur={handlePriceBlur}
            value={formData.price}
            error={!!priceError}
            helperText={priceError}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
    </div>
  );
};

export default CreateStockInForm;