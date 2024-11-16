import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { updateOptional } from "../../components/State/Optional/Action";

const UpdateOptionalForm = ({ event, onClose, onSuccess }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
  });
  
  useEffect(() => {
    if (event) {
      const parsedDate = new Date(event.data.expDate);
      setFormData({
        eventName: event.data.name || "",
        discountPercent: event.data.discountPercent || "",
        expDate: parsedDate,
      });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.eventName,
      discountPercent: formData.discountPercent,
      expDate: formData.expDate,
    };
    try {
      await dispatch(
        updateOptional({
          id: event.data._id,
          name: formData.eventName,
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
          Cập nhật Lựa chọn
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
            Cập nhật
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateOptionalForm;
