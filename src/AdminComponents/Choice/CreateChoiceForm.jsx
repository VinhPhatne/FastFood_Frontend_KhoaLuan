import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { notification } from "antd";
import { createChoice } from "../../components/State/Choice/Action";

const CreateChoiceForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { optionalId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    additionalPrice: "",
  });
  const [priceError, setPriceError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "additionalPrice") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue !== "" && parseFloat(numericValue) < 0) {
        setPriceError("Giá bổ sung không được là số âm");
      } else {
        setPriceError("");
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

  const handlePriceBlur = () => {
    const value = formData.additionalPrice;
    if (value !== "" && parseFloat(value) < 0) {
      setPriceError("Giá bổ sung không được là số âm");
      setFormData({ ...formData, additionalPrice: "" });
    } else {
      setPriceError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (priceError) {
      notification.error({ message: "Vui lòng sửa lỗi giá bổ sung trước khi thêm mới" });
      return;
    }
    try {
      const result = await dispatch(
        createChoice({
          name: formData.name,
          additionalPrice: formData.additionalPrice === "" ? 0 : parseFloat(formData.additionalPrice),
          optional: optionalId,
        })
      );
      if (result) {
        onSuccess();
        notification.success({ message: "Thêm mới thành công!" });
        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Thêm mới thất bại";
      notification.error({ message: errorMessage });
    }
  };

  return (
    <div className="">
      <div className="p-5">
        <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
          Thêm mới Lựa chọn
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Tên Lựa chọn"
            required
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />
          <TextField
            fullWidth
            id="additionalPrice"
            name="additionalPrice"
            label="Giá bổ sung"
            required
            variant="outlined"
            onChange={handleInputChange}
            onBlur={handlePriceBlur}
            value={formData.additionalPrice}
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

export default CreateChoiceForm;