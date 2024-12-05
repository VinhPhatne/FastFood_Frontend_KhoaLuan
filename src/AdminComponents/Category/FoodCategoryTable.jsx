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

  const fetchCategories = () => {
    dispatch(getCategories({ jwt }));
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
    const response = await dispatch(getCategoryById({ id: id, jwt: jwt }));
    if (response) {
      setSelectedCategory(response);
    } else {
      console.error("Response không hợp lệ:", response);
    }

    setOpenFormModal(true);
  };

  const handleCloseFormModal = () => {
    setSelectedCategory(null);
    setOpenFormModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    console.log("Open delete modal for ID:", id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    await dispatch(deleteCategory({ id: deleteId, jwt }));
    setOpenDeleteModal(false);
    fetchCategories();
  };

  const handleBlockUnblock = async (item) => {
    try {
      if (item.isActive) {
        const response = await dispatch(blockCategory({ id: item._id, jwt }));
        notification.success({ message: "Sản phẩm đã bị khóa thành công!" });
      } else {
        const response = await dispatch(unblockCategory({ id: item._id, jwt }));
        notification.success({
          message: "Sản phẩm đã được mở khóa thành công!",
        });
      }
      fetchCategories();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      console.error(error);
      notification.error({ message: errorMessage });
    }
  };
  return (
    <Box
      sx={{
        width: "95%",
        margin: "0px auto",
        marginTop: "100px",
        display: "flex",
        flexDirection: "column",
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
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              height: "40px",
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
                    <TableCell align="left">{item.name}</TableCell>
                    <TableCell align="center">
                      {item.isActive ? "Hoạt động" : "Khóa"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleBlockUnblock(item)}>
                        {item.isActive ? (
                          <LockIcon style={{ color: "#D32F2F" }} />
                        ) : (
                          <LockOpenIcon style={{ color: "#43A047" }} />
                        )}
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          console.log("IDDDD", item._id);
                          handleOpenFormModal(item._id);
                        }}
                      >
                        <CreateIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          console.log("IDDDD", item._id);
                          handleOpenDeleteModal(item._id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
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
            {" "}
            Bạn có chắc chắn muốn xóa danh mục này không?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              className="w-20"
              style={{
                //backgroundColor: "#1565c0",
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
  );
};

export default FoodCategoryTable;
