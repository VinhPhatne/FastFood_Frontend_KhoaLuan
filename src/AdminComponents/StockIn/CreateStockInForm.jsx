import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createEvent } from "../../components/State/Event/Action";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
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

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      await dispatch(
      createIngredient({
        name: formData.name,
        unit: formData.unit,
        quantity: formData.quantity,
        price: formData.price,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
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
            type="number"
            variant="outlined"
            onChange={handleNumberChange}
            value={formData.quantity}
          />
          <TextField
            fullWidth
            id="price"
            name="price"
            label="Giá"
            type="number"
            variant="outlined"
            onChange={handleNumberChange}
            value={formData.price}
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
