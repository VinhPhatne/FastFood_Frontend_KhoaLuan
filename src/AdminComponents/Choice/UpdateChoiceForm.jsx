import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { notification } from "antd";
import { updateChoice } from "../../components/State/Choice/Action";

const UpdateChoiceForm = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { optionalId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    additionalPrice: "",
  });
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.data.name || "",
        additionalPrice: event.data.additionalPrice || "",
      });
    }
  }, [event]);

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
      notification.error({ message: "Vui lòng sửa lỗi giá bổ sung trước khi cập nhật" });
      return;
    }
    try {
      await dispatch(
        updateChoice({
          id: event.data._id,
          name: formData.name,
          additionalPrice: formData.additionalPrice === "" ? 0 : parseFloat(formData.additionalPrice),
          optional: optionalId,
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
          Cập nhật Lựa chọn
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            id="name"
            name="name"
            label="Tên Lựa chọn"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />
          <TextField
            fullWidth
            required
            id="additionalPrice"
            name="additionalPrice"
            label="Giá bổ sung"
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
            Cập nhật
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateChoiceForm;