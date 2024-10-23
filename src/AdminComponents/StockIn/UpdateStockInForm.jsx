import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIngredient } from "../../components/State/Import/Action";

const UpdateStockInForm = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    quantity: "",
    price: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateIngredient({
        id: event._id,
        name: formData.name,
        unit: formData.unit,
        quantity: formData.quantity,
        price: formData.price,
        jwt: localStorage.getItem("jwt"),
      })
    ).then(() => {
      onSuccess();
      onClose();
    });
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
          Cập nhật sự kiện
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

export default UpdateStockInForm;
