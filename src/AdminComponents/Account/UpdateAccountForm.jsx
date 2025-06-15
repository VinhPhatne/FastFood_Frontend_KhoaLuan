import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateUser,
} from "../../components/State/User/Action";
import { notification } from "antd";

const UpdateAccountForm = ({ account, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullname: "",
    phonenumber: "",
    password: "",
    address: "",
    email: "",
    role: "",
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (account) {
      setFormData({
        fullname: account.data.fullname || "",
        phonenumber: account.data.phonenumber || "",
        password: account.data.password || "",
        address: "",
        email: "",
        role: "",
      });
    }
  }, [account]);

  const phoneRegex = /^0[0-9]{9}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phonenumber") {
      if (!phoneRegex.test(value) && value !== "") {
        setPhoneError("Số điện thoại phải bắt đầu bằng 0 và gồm 10 chữ số");
      } else {
        setPhoneError("");
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneBlur = () => {
    if (!phoneRegex.test(formData.phonenumber) && formData.phonenumber !== "") {
      setPhoneError("Số điện thoại phải bắt đầu bằng 0 và gồm 10 chữ số");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      notification.error({ message: "Vui lòng sửa lỗi số điện thoại trước khi cập nhật" });
      return;
    }
    const accountData = {
      fullname: formData.fullname,
      phonenumber: formData.phonenumber,
      password: formData.password,
      email: formData.email,
    };
    try {
      await dispatch(
        updateUser(account.data._id, {
          fullname: formData.fullname,
          phonenumber: formData.phonenumber,
          email: formData.email,
          password: formData.password,
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
          Cập nhật tài khoản
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            id="fullname"
            name="fullname"
            label="Họ tên"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.fullname}
          />
          <TextField
            fullWidth
            required
            id="phonenumber"
            name="phonenumber"
            label="Số điện thoại"
            variant="outlined"
            onChange={handleInputChange}
            onBlur={handlePhoneBlur}
            value={formData.phonenumber}
            error={!!phoneError}
            helperText={phoneError}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            fullWidth
            required
            id="password"
            name="password"
            label="Mật khẩu"
            variant="outlined"
            type="password"
            onChange={handleInputChange}
            value={formData.password}
          />
          <TextField
            fullWidth
            required
            id="address"
            name="address"
            label="Địa chỉ"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.address}
          />
          <TextField
            fullWidth
            required
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.email}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Manager</MenuItem>
              <MenuItem value={3}>Customer</MenuItem>
            </Select>
          </FormControl>
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

export default UpdateAccountForm;