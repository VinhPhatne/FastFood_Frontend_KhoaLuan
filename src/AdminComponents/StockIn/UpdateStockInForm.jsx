import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateIngredient } from "../../components/State/Import/Action";
import { notification } from "antd";

const UpdateStockInForm = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    quantity: "",
    price: "",
  });
  const [quantityError, setQuantityError] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        unit: event.unit || "",
        quantity: event.quantity || "",
        price: event.price || "",
      });
    }
  }, [event]);

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
      notification.error({ message: "Vui lòng sửa lỗi số lượng hoặc giá trước khi cập nhật" });
      return;
    }
    try {
      await dispatch(
        updateIngredient({
          id: event._id,
          name: formData.name,
          unit: formData.unit,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          jwt: localStorage.getItem("jwt"),
        })
      );
      onSuccess();
      notification.success({ message: "Cập nhật thành công!" });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Cập nhật thất bại";
      notification.error({ message: errorMessage });
    }
  };

  return (
    <div className="">
      <div className="p-5">
        <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
          Cập nhật Nguyên liệu
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
            Cập nhật
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockInForm;