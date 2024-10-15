import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEvent } from "../../components/State/Event/Action";

//import { createeventAction } from "../../component/State/Restaurant/Action";

const UpdateEventForm = ({ event, onClose }) => {
  //const {restaurant} = useSelector(store => store)

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    eventName: "",
    eventId: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        eventName: event.data.name || "",
        discountPercent: event.data.discountPercent || "",
        expDate: event.data.expDate || "",
      });
    } else {
      setFormData({
        eventName: "",
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.eventName,
      discountPercent: formData.discountPercent,
      expDate: formData.expDate,
    };
    dispatch(
      updateEvent({
        id: event.data._id,
        name: formData.eventName,
        discountPercent: formData.discountPercent,
        expDate: formData.expDate,
        jwt: localStorage.getItem("jwt"),
      })
    );
    console.log(data);
    onClose();
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
        <h1 className="text-orange-600 text-center text-xl pb-10">
          Sửa danh mục
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
          <TextField
            fullWidth
            id="discountPercent"
            name="discountPercent"
            label="Giảm giá"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.discountPercent}
          ></TextField>
          <TextField
            fullWidth
            id="expDate"
            name="expDate"
            label="Ngày hết hạn"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.expDate}
          ></TextField>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            style={{ color: "#fff", backgroundColor: "#ff7d01" }}
          >
            Sửa danh mục
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventForm;
