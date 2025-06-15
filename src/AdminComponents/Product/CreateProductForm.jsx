import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { uploadImageToCloudinary } from "../util/UploadToCloudaniry";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../components/State/Category/Action";
import { createProduct } from "../../components/State/Product/Action";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const initialValues = {
  name: "",
  description: "",
  price: "",
  picture: "",
  category: null,
};

const validationSchema = Yup.object({
  name: Yup.string().required("Tên sản phẩm là bắt buộc"),
  description: Yup.string().required("Mô tả là bắt buộc"),
  price: Yup.number()
    .required("Giá là bắt buộc")
    .positive("Giá phải là số dương")
    .typeError("Giá phải là một số"),
  picture: Yup.string().required("Hình ảnh là bắt buộc"),
  category: Yup.object().required("Danh mục là bắt buộc"),
});

const CreateProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  const [priceError, setPriceError] = useState("");
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );

  useEffect(() => {
    dispatch(getCategories({ jwt }));
  }, [dispatch, jwt]);

  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (priceError) {
        notification.error({ message: "Vui lòng sửa lỗi giá sản phẩm trước khi thêm mới" });
        return;
      }
      const productData = {
        price: parseFloat(values.price),
        picture: values.picture,
        name: values.name,
        description: values.description,
        category: values.category ? values.category._id : null,
      };

      try {
        await dispatch(createProduct(productData));
        notification.success({ message: "Thêm mới thành công!" });
        navigate("/admin/product");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Tạo mới thất bại";
        notification.error({ message: errorMessage });
      }
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setUploadImage(true);
    const image = await uploadImageToCloudinary(file);
    formik.setFieldValue("picture", image);
    setUploadImage(false);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("picture", "");
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || parseFloat(numericValue) <= 0) {
      setPriceError("Giá phải là một số dương");
    } else {
      setPriceError("");
    }
    formik.setFieldValue("price", numericValue);
  };

  const handlePriceBlur = () => {
    const value = formik.values.price;
    if (!value || parseFloat(value) <= 0) {
      setPriceError("Giá phải là một số dương");
      formik.setFieldValue("price", "");
    } else {
      setPriceError("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-5">
      <div className="lg:max-w-4xl w-full">
        <h1 className="font-bold text-2xl text-center py-2">
          Thêm mới sản phẩm
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2} justifyContent="flex-start">
            <Grid item xs={12}>
              <div className="flex items-center">
                <label htmlFor="picture" className="block font-medium mb-1 w-1/4">
                  Hình ảnh:
                </label>
                <div className="flex items-center w-full">
                  <input
                    accept="image/*"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    type="file"
                  />
                  <label htmlFor="fileInput">
                    {!formik.values.picture ? (
                      <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                        <AddPhotoAlternateIcon />
                      </span>
                    ) : (
                      <div className="relative w-24 h-24 border rounded-md overflow-hidden border-gray-600">
                        <img
                          className="w-full h-full object-cover"
                          src={formik.values.picture}
                          alt="Product"
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                          }}
                          onClick={handleRemoveImage}
                        >
                          <CloseIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </div>
                    )}
                  </label>
                  {uploadImage && (
                    <CircularProgress size={24} className="ml-4" />
                  )}
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="flex items-center">
                <label htmlFor="name" className="block font-medium mb-1 w-1/4">
                  Tên sản phẩm:
                </label>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ maxWidth: "100%" }}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="flex items-center">
                <label htmlFor="description" className="block font-medium mb-1 w-1/4">
                  Mô tả:
                </label>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  variant="outlined"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  sx={{ maxWidth: "100%" }}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="flex items-center">
                <label htmlFor="price" className="block font-medium mb-1 w-1/4">
                  Giá:
                </label>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  variant="outlined"
                  onChange={handlePriceChange}
                  onBlur={handlePriceBlur}
                  value={formik.values.price}
                  error={formik.touched.price && (Boolean(formik.errors.price) || Boolean(priceError))}
                  helperText={(formik.touched.price && formik.errors.price) || priceError}
                  sx={{ maxWidth: "100%" }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="flex items-center">
                <label htmlFor="category" className="block font-medium mb-1 w-1/4">
                  Danh mục:
                </label>
                <FormControl fullWidth sx={{ maxWidth: "100%" }}>
                  <Select
                    id="category"
                    value={formik.values.category ? formik.values.category._id : ""}
                    onChange={(e) => {
                      const selectedCategory = categories.find(
                        (cat) => cat._id === e.target.value
                      );
                      formik.setFieldValue("category", selectedCategory);
                    }}
                    name="category"
                    error={formik.touched.category && Boolean(formik.errors.category)}
                  >
                    {categories &&
                      categories.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div className="flex justify-end mt-4">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ maxWidth: "400px" }}
              >
                Thêm mới
              </Button>
            </div>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;