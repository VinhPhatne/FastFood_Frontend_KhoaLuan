import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../components/State/Category/Action";
//import { createCategoryAction } from "../../component/State/Restaurant/Action";

const UpdateFoodCategoryForm = ({ category, onClose }) => {
  //const {restaurant} = useSelector(store => store)

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryId: "",
    // restaurantId: "",
  });

  console.log("CHECK >>>", category.data.name);

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.data.name || "",
      });
    } else {
      setFormData({
        categoryName: "",
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.categoryName,
      // restaurantId: {
      //   id: 1,
      // },
    };
    dispatch(
      updateCategory({
        id: category.data._id,
        name: formData.categoryName,
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

  //console.log("Category >>>", category.name);

  return (
    <div className="">
      <div className="p-5">
        <h1 className="text-orange-600 text-center text-xl pb-10">
          Sửa danh mục
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="categoryName"
            name="categoryName"
            label="Food Category"
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
            Sửa danh mục
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateFoodCategoryForm;
