import {
  Box,
  Button,
  Card,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Spin } from "antd"; // Import Spin from antd
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  blockCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  unblockCategory,
} from "../../components/State/Category/Action";
import { Delete } from "@mui/icons-material";
import CreateFoodCategoryForm from "./CreateFoodCategoryForm";
import UpdateFoodCategoryForm from "./UpdateFoodCategoryForm";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { notification } from "antd";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const FoodCategoryTable = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const [isLoading, setIsLoading] = useState(false); // Local loading state

  const jwt = localStorage.getItem("jwt");

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchCategories = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(getCategories({ jwt }));
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [dispatch, jwt]);

  useEffect(() => {
    const filtered = categories?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered || []);
  }, [categories, searchTerm]);

  const handleClearSearch = () => setSearchTerm("");

  const handleOpenFormModal = async (id) => {
    setIsLoading(true); // Start loading
    try {
      const response = await dispatch(getCategoryById({ id: id, jwt: jwt }));
      if (response) {
        setSelectedCategory(response);
      } else {
        console.error("Response không hợp lệ:", response);
      }
      setOpenFormModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCloseFormModal = () => {
    setSelectedCategory(null);
    setOpenFormModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(deleteCategory({ id: deleteId, jwt }));
      setOpenDeleteModal(false);
      await fetchCategories();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleBlockUnblock = async (item) => {
    setIsLoading(true); // Start loading
    try {
      if (item.isActive) {
        await dispatch(blockCategory({ id: item._id, jwt }));
        notification.success({ message: "Danh mục đã bị khóa thành công!" });
      } else {
        await dispatch(unblockCategory({ id: item._id, jwt }));
        notification.success({
          message: "Danh mục đã được mở khóa thành công!",
        });
      }
      await fetchCategories();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      console.error(error);
      notification.error({ message: errorMessage });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Spin spinning={isLoading} size="large">
      <Box
        sx={{
          width: "95%",
          margin: "0px auto",
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensure full height for centered loading
        }}
      >
        {/* Search and Create Button Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: "50px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm(searchTerm)}>
                    <SearchIcon />
                  </IconButton>
                  <IconButton onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
          >
            Thêm mới
          </Button>
        </Box>

        {/* Table Section */}
        <Card sx={{ boxShadow: "0 3px 5px rgba(0,0,0,0.1)" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Food Category Table">
              <TableHead sx={{ backgroundColor: "#fdba74" }}>
                <TableRow>
                  <TableCell align="left" sx={{ color: "#000" }}>
                    #
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#000" }}>
                    Hình ảnh
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#000" }}>
                    Tên danh mục
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#000" }}>
                    Hoạt động
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories?.length > 0 ? (
                  filteredCategories.map((item, index) => (
                    <TableRow
                      key={item._id}
                      sx={{
                        "&:hover": { backgroundColor: "#FFF3E0" },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="center">
                        {item.isActive ? "Hoạt động" : "Khóa"}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleOpenFormModal(item._id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                         <IconButton onClick={() => handleBlockUnblock(item)}>
                          {item.isActive ? (
                            <Delete style={{ color: "#D32F2F" }} />
                          ) : (
                            <LockOpenIcon style={{ color: "#43A047" }} />
                          )}
                        </IconButton>
                        {/* <IconButton
                          color="error"
                          onClick={() => {
                            handleOpenDeleteModal(item._id);
                          }}
                        >
                          <Delete />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>No categories available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Modal Section */}
        <Modal open={openFormModal} onClose={handleCloseFormModal}>
          <Box sx={style}>
            <UpdateFoodCategoryForm
              category={selectedCategory}
              onClose={handleCloseFormModal}
              onSuccess={fetchCategories}
            />
          </Box>
        </Modal>

        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <Box sx={style}>
            <Typography variant="h6">Xác nhận xóa</Typography>
            <Typography>
              Bạn có chắc chắn muốn xóa danh mục này không?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                className="w-20"
                style={{
                  color: "#000",
                  marginRight: "8px",
                  fontWeight: "400",
                  border: "0.5px solid black",
                }}
                onClick={() => setOpenDeleteModal(false)}
              >
                Hủy
              </Button>
              <Button
                className="w-24"
                style={{
                  backgroundColor: "#ff7d01",
                  color: "#fff",
                  fontWeight: "500",
                }}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <CreateFoodCategoryForm
              onSuccess={fetchCategories}
              onClose={handleClose}
            />
          </Box>
        </Modal>
      </Box>
    </Spin>
  );
};

export default FoodCategoryTable;