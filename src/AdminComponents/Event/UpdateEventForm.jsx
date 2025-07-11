import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../../components/State/Event/Action";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { notification } from "antd";

const UpdateEventForm = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    eventName: "",
    discountPercent: "",
    expDate: null,
  });
  const [discountError, setDiscountError] = useState("");

  console.log('event', event)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "discountPercent") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue === "" || parseFloat(numericValue) <= 0) {
        setDiscountError("Giảm giá phải là một số dương");
      } else {
        setDiscountError("");
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

  const handleDiscountBlur = () => {
    const value = formData.discountPercent;
    if (!value || parseFloat(value) <= 0) {
      setDiscountError("Giảm giá phải là một số dương");
      setFormData({ ...formData, discountPercent: "" });
    } else {
      setDiscountError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (discountError) {
      notification.error({ message: "Vui lòng sửa lỗi giảm giá trước khi cập nhật" });
      return;
    }
    const data = {
      name: formData.eventName,
      discountPercent: formData.discountPercent,
      expDate: formData.expDate,
    };
    try {
      await dispatch(
        updateEvent({
          id: event.data._id,
          name: formData.eventName,
          discountPercent: parseFloat(formData.discountPercent),
          expDate: format(formData.expDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
          jwt: localStorage.getItem("jwt"),
          products: event?.data?.products,
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
          Cập nhật sự kiện
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            id="eventName"
            name="eventName"
            label="Tên sự kiện"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.eventName}
          />
          <TextField
            fullWidth
            required
            id="discountPercent"
            name="discountPercent"
            label="Giảm giá"
            variant="outlined"
            onChange={handleInputChange}
            onBlur={handleDiscountBlur}
            value={formData.discountPercent}
            error={!!discountError}
            helperText={discountError}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
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
              required
              renderInput={(params) => (
                <TextField {...params} className="w-96" variant="outlined" />
              )}
            />
          </LocalizationProvider>
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

export default UpdateEventForm;