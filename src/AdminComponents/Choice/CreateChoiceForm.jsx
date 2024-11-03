import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
import { createChoice } from "../../components/State/Choice/Action";

const CreateChoiceForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { optionalId } = useParams(); 

  const [formData, setFormData] = useState({
    name: "",
    additionalPrice: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        createChoice({
          name: formData.name,
          additionalPrice: parseFloat(formData.additionalPrice),
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />
          <TextField
            fullWidth
            id="additionalPrice"
            name="additionalPrice"
            label="Giá bổ sung"
            variant="outlined"
            type="number"
            onChange={handleInputChange}
            value={formData.additionalPrice}
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
