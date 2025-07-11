import {
  Card,
  TableContainer,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { Spin } from "antd"; // Import Spin from antd
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ClearIcon from "@mui/icons-material/Clear";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  blockProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsListPage,
  unBlockProduct,
  updateOptionalProduct,
} from "../../components/State/Product/Action";
import { getCategories } from "../../components/State/Category/Action";
import { message, notification } from "antd";
import { getOptionals } from "../../components/State/Optional/Action";

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

const ProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false); // Local loading state

  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const { products } = useSelector((state) => state.productReducer);
  const { optionals } = useSelector((state) => state.optionalReducer.optionals);
  const jwt = localStorage.getItem("jwt");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSell, setIsSell] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [openOptionalModal, setOpenOptionalModal] = useState(false);
  const [selectedOptionals, setSelectedOptionals] = useState(new Set());
  const [currentProductId, setCurrentProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = async () => {
    setIsLoading(true); // Start loading
    try {
      setCurrentPage(1);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.set("search", searchTerm);
      }
      if (selectedCategory) {
        params.set("category", selectedCategory);
      }
      if (isSell) {
        params.set("isSell", isSell);
      }
      navigate(`?${params.toString()}`);
      await dispatch(
        getProductsListPage({
          jwt,
          search: searchTerm,
          cateId: selectedCategory,
          isSelling: isSell,
        })
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleClearSearch = async () => {
    setIsLoading(true); // Start loading
    try {
      setSearchTerm("");
      setSelectedCategory("");
      setIsSell("");
      searchParams.delete("category");
      searchParams.delete("search");
      searchParams.delete("isSell");
      setSearchParams(searchParams);
      const search = "";
      const page = 1;
      setCurrentPage(page);
      await dispatch(getProductsListPage({ jwt, page, search }));
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleIsSellChange = (event) => {
    setIsSell(event.target.value);
  };

  const handlePageChange = async (event, value) => {
    setIsLoading(true); // Start loading
    try {
      const params = new URLSearchParams(location.search);
      const search = params.get("search");
      const cateId = params.get("category");
      const isSell = params.get("isSell");
      if (search) {
        params.set("search", search);
      }
      if (cateId) {
        params.set("category", cateId);
      }
      if (isSell) {
        params.set("isSell", isSell);
      }
      setCurrentPage(value);
      setSearchParams(params.toString());
      await dispatch(
        getProductsListPage({
          jwt,
          page: value,
          search,
          cateId,
          isSelling: isSell,
        })
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const fetchEvents = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(getOptionals({ jwt }));
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [dispatch, jwt]);

  useEffect(() => {
    setIsLoading(true); // Start loading
    const pageFromParams = searchParams.get("page");
    const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
    setCurrentPage(page);
    Promise.all([
      dispatch(getProductsListPage({ jwt, page })),
      dispatch(getCategories({ jwt })),
    ]).finally(() => setIsLoading(false)); // Stop loading
  }, [dispatch, jwt]);

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(deleteProduct({ id: deleteId, jwt }));
      setOpenDeleteModal(false);
      const pageFromParams = searchParams.get("page");
      const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
      setCurrentPage(page);
      await dispatch(getProductsListPage({ jwt, page }));
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleBlockUnblockProduct = async (item) => {
    setIsLoading(true); // Start loading
    try {
      if (item.isSelling) {
        await dispatch(blockProduct({ id: item._id, jwt }));
        notification.success({ message: "Sản phẩm đã bị khóa thành công!" });
      } else {
        await dispatch(unBlockProduct({ id: item._id, jwt }));
        notification.success({
          message: "Sản phẩm đã được mở khóa thành công!",
        });
      }
      const pageFromParams = searchParams.get("page");
      const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
      setCurrentPage(page);
      await dispatch(getProductsListPage({ jwt, page }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      console.error(error);
      notification.error({ message: errorMessage });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOpenOptionalModal = async (productId) => {
    setIsLoading(true); // Start loading
    try {
      setCurrentProductId(productId);
      const eventResponse = await dispatch(
        getProductById({ id: productId, jwt })
      );
      if (eventResponse) setSelectedProduct(eventResponse);
      if (eventResponse && eventResponse.data) {
        const optionIds = eventResponse.data.options.map((option) => option._id);
        setSelectedOptionals(new Set(optionIds));
      }
      await fetchEvents();
      setOpenOptionalModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCloseOptionalModal = () => {
    setOpenOptionalModal(false);
    setSelectedOptionals(new Set());
  };

  const handleToggleProduct = (productId) => {
    setSelectedOptionals((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleUpdateOptional = async () => {
    setIsLoading(true); // Start loading
    try {
      const selectedProductArray = Array.from(selectedOptionals);
      await dispatch(
        updateOptionalProduct({
          jwt,
          id: currentProductId,
          optionalData: selectedProductArray,
        })
      );
      const pageFromParams = searchParams.get("page");
      const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
      setCurrentPage(page);
      await dispatch(getProductsListPage({ jwt, page }));
      handleCloseOptionalModal();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Spin spinning={isLoading} size="large">
      <Box
        sx={{
          width: "95%",
          justifyContent: "center",
          alignItems: "center",
          margin: "0px auto",
          marginTop: "100px",
          minHeight: "100vh", // Ensure full height for centered loading
        }}
      >
        <Box
          sx={{
            display: "flex",
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
          />

          <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
            <InputLabel>Trạng thái bán</InputLabel>
            <Select
              value={isSell}
              onChange={handleIsSellChange}
              label="Trạng thái bán"
            >
              <MenuItem value={true}>Đang bán</MenuItem>
              <MenuItem value={false}>Ngừng bán</MenuItem>
            </Select>
          </FormControl>

          <InputAdornment position="end">
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => handleClearSearch()} edge="end">
              <ClearIcon />
            </IconButton>
          </InputAdornment>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("create")}
            sx={{
              ml: "auto",
              height: "40px",
              borderRadius: "20px",
            }}
          >
            Thêm mới
          </Button>
        </Box>
        <Card sx={{ boxShadow: "0 3px 5px rgba(0,0,0,0.1)" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead
                sx={{
                  backgroundColor: "#fdba74",
                }}
              >
                <TableRow>
                  <TableCell align="left" sx={{ color: "#000" }}>
                    Hình ảnh
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#000" }}>
                    Tên sản phẩm
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Giá
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Giá hiện tại
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Danh mục
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#000" }}>
                    Trạng thái
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#000" }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(products.products) &&
                products.products.length > 0 ? (
                  products.products.map((item, index) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#FFF3E0" },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <img
                          src={item.picture}
                          alt={item.name}
                          style={{
                            width: "100px",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="right">{item.price.toLocaleString()} VND</TableCell>
                      <TableCell align="right">{item.currentPrice.toLocaleString()} VND</TableCell>
                      <TableCell align="right">
                        {item.category ? item.category.name : ""}
                      </TableCell>
                      <TableCell align="center">
                        {item.isSelling ? (
                          <span style={{ color: "#43A047" }}>Đang bán</span>
                        ) : (
                          <span style={{ color: "#D32F2F" }}>Khóa</span>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => navigate(`${item._id}`)}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleBlockUnblockProduct(item)}
                        >
                          {item.isSelling ? (
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
                        <IconButton
                          onClick={() => handleOpenOptionalModal(item._id)}
                        >
                          <AddBoxIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>No products available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {Array.isArray(products.products) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              count={products.pagination.totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <Box sx={style}>
            <Typography variant="h6">Xác nhận xóa</Typography>
            <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
              <Button onClick={handleDelete}>Xóa</Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal quản lý optional */}
        <Modal open={openOptionalModal} onClose={handleCloseOptionalModal}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                padding: 4,
                backgroundColor: "white",
                maxWidth: 500,
                width: "100%",
                borderRadius: 2,
                boxShadow: 24,
              }}
            >
              <Typography variant="h6">Chọn Optional cho sản phẩm</Typography>
              <List>
                {optionals?.map((optional) => (
                  <ListItem key={optional._id} disablePadding>
                    <ListItemButton
                      role={undefined}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          checked={selectedOptionals.has(optional._id)}
                          onChange={() => {
                            handleToggleProduct(optional._id);
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={optional.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseOptionalModal}>Hủy</Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateOptional}
                >
                  Cập nhật
                </Button>
              </div>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Spin>
  );
};

export default ProductTable;
