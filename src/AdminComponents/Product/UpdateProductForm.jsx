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
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../components/State/Product/Action";
import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
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

const UpdateProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryId: "",
  });

  console.log("id", id);
  const jwt = localStorage.getItem("jwt");

  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await dispatch(getProductById({ id, jwt }));
        if (response) {
          setSelectedProduct(response.data);
          // Điền dữ liệu vào formik
          const category = categories.find(
            (cat) => cat._id === response.data.category
          );
          formik.setValues({
            name: response.data.name || "",
            description: response.data.description || "",
            price: response.data.price || "",
            picture: response.data.picture || "",
            category: {
              _id: response.data.category._id,
              name: response.data.category.name,
            },
          });
        } else {
          console.error("Response không hợp lệ:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [dispatch, id, jwt]);

  console.log("selectedProduct", selectedProduct);

  useEffect(() => {
    dispatch(getCategories({ jwt }));
  }, [dispatch, jwt]);

  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const productData = {
        ...values,
        price: parseFloat(values.price),
        picture: values.picture,
        name: values.name,
        description: values.description,
        category: values.category || null,
      };
      try {
        dispatch(
          updateProduct({
            id,
            productData,
          })
        );
        navigate("/admin/product");
        notification.success({ message: "Cập nhật thành công!" });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Cập nhật thất bại";
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

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-5">
      <div className="lg:max-w-4xl w-full">
        <h1 className="font-bold text-2xl text-center py-2">
          Cập nhật sản phẩm
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

            {/* Row for name field */}
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

            {/* Row for description field */}
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

            {/* Row for price field */}
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
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  sx={{ maxWidth: "100%" }}
                />
              </div>
            </Grid>

            {/* Row for category field */}
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

export default UpdateProductForm;
