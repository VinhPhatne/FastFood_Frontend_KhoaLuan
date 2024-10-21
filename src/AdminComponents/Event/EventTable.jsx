import {
  Box,
  Button,
  Card,
  CardHeader,
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
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEvent,
  getEvents,
  getEventById,
} from "../../components/State/Event/Action";
import { Delete } from "@mui/icons-material";
import CreateEventForm from "./CreateEventForm";
import UpdateEventForm from "./UpdateEventForm";
import { getProductsByCategory } from "../../components/State/Product/Action";
import { getCategories } from "../../components/State/Category/Action";

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

const EventTable = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.eventReducer.events);
  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );

  console.log("categories", categories);

  const jwt = localStorage.getItem("jwt");

  const [openProductModal, setOpenProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [currentEventId, setCurrentEventId] = useState(null);

  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // useEffect(() => {
  //   dispatch(getEvents({ jwt }));
  // }, [dispatch, jwt]);

  const fetchEvents = () => {
    dispatch(getEvents({ jwt }));
  };

  useEffect(() => {
    fetchEvents();
    fetchProductsAndCategories();
  }, [dispatch, jwt]);

  useEffect(() => {
    const filtered = events?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered || []);
  }, [events, searchTerm]);

  const handleClearSearch = () => setSearchTerm("");

  const handleOpenFormModal = async (id) => {
    const response = await dispatch(getEventById({ id, jwt }));
    if (response) {
      setSelectedEvent(response);
    } else {
      console.error("Response không hợp lệ:", response);
    }
    setOpenEditModal(true);
  };

  const handleCloseFormModal = () => {
    setSelectedEvent(null);
    setOpenEditModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    await dispatch(deleteEvent({ id: deleteId, jwt }));
    setOpenDeleteModal(false);
    fetchEvents();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchProductsAndCategories = async () => {
    const response = await dispatch(getCategories({ jwt }));
    console.log("response", response);
    setProducts(response || []);
  };

  const handleOpenProductModal = async (eventId) => {
    setCurrentEventId(eventId);
    await fetchProductsAndCategories();
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setSelectedProducts(new Set()); // Reset lựa chọn
  };

  // Xử lý khi chọn checkbox
  const handleToggleProduct = (productId) => {
    setSelectedProducts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleSaveProducts = async () => {
    const selectedProductArray = Array.from(selectedProducts);
    // Gọi API hoặc dispatch action để lưu sản phẩm vào sự kiện
    console.log("Sản phẩm được chọn:", selectedProductArray);
    // Sau đó đóng Modal
    handleCloseProductModal();
  };

  return (
    <Box sx={{ width: "95%", margin: "0px auto", marginTop: "100px" }}>
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
          <Table sx={{ minWidth: 650 }} aria-label="Event Table">
            <TableHead sx={{ backgroundColor: "#fdba74" }}>
              <TableRow>
                <TableCell align="left">Id</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Giảm giá</TableCell>
                <TableCell align="right">Ngày hết hạn</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((item, index) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:hover": { backgroundColor: "#FFF3E0" } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{item.name}</TableCell>
                    <TableCell align="center">
                      {item.discountPercent} %
                    </TableCell>
                    <TableCell align="right">{item.expDate}</TableCell>
                    <TableCell align="center">
                      {item.isActive ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell align="right">
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
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenProductModal(item._id)}
                      >
                        Quản lý sản phẩm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>No events available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal quản lý sản phẩm */}
      <Modal open={openProductModal} onClose={handleCloseProductModal}>
        <Box sx={{ ...style, width: 600 }}>
          <Typography variant="h6" mb={2}>
            Chọn sản phẩm cho sự kiện
          </Typography>
          <Box
            sx={{
              maxHeight: 400, // Giới hạn chiều cao tối đa
              overflowY: "auto", // Kích hoạt cuộn dọc nếu vượt quá
              paddingRight: 2, // Thêm padding để tránh thanh cuộn che nội dung
            }}
          >
            {categories.map((category) => (
              <Box key={category._id} mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  {category.name}
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)", // Tối đa 3 sản phẩm mỗi hàng
                    gap: 2,
                  }}
                >
                  {category.products.map((product) => (
                    <Box
                      key={product._id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        padding: 2,
                      }}
                    >
                      <img
                        src={product.picture}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: 80,
                          objectFit: "cover",
                        }}
                      />
                      <Typography variant="body1" mt={1}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Giá: {product.currentPrice.toLocaleString()} VND
                      </Typography>
                      <Checkbox
                        checked={selectedProducts.has(product._id)}
                        onChange={() => handleToggleProduct(product._id)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseProductModal}>Hủy</Button>
            <Button variant="contained" onClick={handleSaveProducts}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Section */}
      <Modal open={openEditModal} onClose={handleCloseFormModal}>
        <Box sx={style}>
          <UpdateEventForm
            event={selectedEvent}
            onSuccess={fetchEvents}
            onClose={handleCloseFormModal}
          />
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={style}>
          <Typography variant="h6">Xác nhận xóa</Typography>
          <Typography>Bạn có chắc chắn muốn xóa sự kiện này không?</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
            <Button onClick={handleDelete}>Xóa</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <CreateEventForm
            onSuccess={fetchEvents}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default EventTable;
