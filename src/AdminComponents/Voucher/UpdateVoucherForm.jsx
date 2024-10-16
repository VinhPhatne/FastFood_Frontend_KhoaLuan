import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateVoucher } from "../../components/State/voucher/Action";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const UpdateVoucherForm = ({ voucher, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    code: "",
    //expDate: null,
  });

  useEffect(() => {
    if (voucher) {
      setFormData({
        name: voucher.data.name || "",
        discount: voucher.data.discount || "",
        code: voucher.data.code || "",
        //expDate: voucher.data.expDate || null,
      });
    }
  }, [voucher]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateVoucher({
        id: voucher.data._id,
        code: formData.code,
        name: formData.name,
        discount: formData.discount,
        //expDate: formData.expDate,
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

  return (
    <div className="p-5">
      <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
        Cập nhật Voucher
      </h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Tên Voucher */}
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Tên Voucher"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
        />

        {/* Giảm giá (Chỉ cho nhập số) */}
        <TextField
          fullWidth
          id="discount"
          name="discount"
          label="Giảm giá"
          variant="outlined"
          type="number"
          onChange={handleInputChange}
          value={formData.discount}
          inputProps={{ min: 0, max: 1000000000 }}
        />

        {/* Mã Voucher */}
        <TextField
          fullWidth
          id="code"
          name="code"
          label="Code"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.code}
        />

        {/* Ngày hết hạn */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Ngày hết hạn"
            value={formData.expDate}
            onChange={(newValue) =>
              setFormData({ ...formData, expDate: newValue })
            }
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider> */}

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
  );
};

export default UpdateVoucherForm;
