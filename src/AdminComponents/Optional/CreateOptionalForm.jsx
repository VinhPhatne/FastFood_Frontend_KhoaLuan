import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { createOptional } from "../../components/State/Optional/Action";

const CreateOptionalForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        createOptional({
          name: formData.eventName,
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
            id="eventName"
            name="eventName"
            label="Tên tùy chọn"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.eventName}
            required
          ></TextField>
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

export default CreateOptionalForm;
