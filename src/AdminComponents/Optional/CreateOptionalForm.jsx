import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../../components/State/Event/Action";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { createOptional } from "../../components/State/Optional/Action";

const CreateOptionalForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
    //discountPercent: "",
    //expDate: null,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.eventName,
      //discountPercent: formData.discountPercent,
      //expDate: formData.expDate ? format(formData.expDate, "yyyy/MM/dd") : "",
    };
    try {
      const result = await dispatch(
        createOptional({
          name: formData.eventName,
          //discountPercent: formData.discountPercent,
          //expDate: data.expDate,
          //jwt: localStorage.getItem("jwt"),
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
            label="Food event"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.eventName}
          ></TextField>
          {/* <TextField
            fullWidth
            id="discountPercent"
            name="discountPercent"
            label="Giảm giá"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.discountPercent}
          ></TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              className="w-full"
              label="Ngày hết hạn"
              value={formData.expDate}
              onChange={(newValue) => {
                setFormData({ ...formData, expDate: newValue });
              }}
              format="dd/MM/yyyy"
              inputFormat="dd/MM/yyyy"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} className="w-96" variant="outlined" />
              )}
            />
          </LocalizationProvider> */}
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
