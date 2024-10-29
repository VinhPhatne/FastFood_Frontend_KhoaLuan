import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
} from "../../components/State/Category/Action";
import { notification } from "antd";

const CreateFoodCategoryForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    categoryName: "",
    restaurantId: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        createCategory({
          name: formData.categoryName,
          jwt: localStorage.getItem("jwt"),
        })
      );

      console.log("result", result);
  
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
          Thêm mới danh mục
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="categoryName"
            name="categoryName"
            label="Tên danh mục"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.categoryName}
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

export default CreateFoodCategoryForm;
