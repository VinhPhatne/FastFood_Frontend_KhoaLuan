import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../../components/State/Category/Action";
import { notification } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { uploadImageToCloudinary } from "../util/UploadToCloudaniry"; // Giả sử bạn đã có util này

const validationSchema = Yup.object({
  categoryName: Yup.string().required("Tên danh mục là bắt buộc"),
  image: Yup.string().required("Hình ảnh là bắt buộc"),
});

const CreateFoodCategoryForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      image: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(
          createCategory({
            name: values.categoryName,
            image: values.image,
            jwt: localStorage.getItem("jwt"),
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
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setUploadImage(true);
    const image = await uploadImageToCloudinary(file);
    formik.setFieldValue("image", image);
    setUploadImage(false);
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", "");
  };

  return (
    <div className="">
      <div className="p-5">
        <h1 className="text-orange-600 font-semibold text-center text-2xl pb-10">
          Thêm mới danh mục
        </h1>
        <form className="space-y-5" onSubmit={ formik.handleSubmit }>
          <div className="flex items-center">
            <div className="flex justify-center items-center w-full">
              <input
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
                type="file"
              />
              <label htmlFor="fileInput">
                {!formik.values.image ? (
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                    <AddPhotoAlternateIcon />
                  </span>
                ) : (
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden border-gray-600">
                    <img
                      className="w-full h-full object-cover"
                      src={formik.values.image}
                      alt="Category"
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
              {uploadImage && <CircularProgress size={24} className="ml-4" />}
            </div>
          </div>
          {formik.touched.image && formik.errors.image && (
            <div className="text-red-600 text-sm mt-1">{formik.errors.image}</div>
          )}
          <TextField
            fullWidth
            required
            id="categoryName"
            name="categoryName"
            label="Tên danh mục"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.categoryName}
            error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
            helperText={formik.touched.categoryName && formik.errors.categoryName}
          />
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