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
  Checkbox,
} from "@mui/material";
import { Spin } from "antd"; // Import Spin from antd
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEvent,
  getEvents,
  getEventById,
  blockEvent,
  unblockEvent,
} from "../../components/State/Event/Action";
import { Delete } from "@mui/icons-material";
import CreateEventForm from "./CreateEventForm";
import UpdateEventForm from "./UpdateEventForm";
import { getCategories } from "../../components/State/Category/Action";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { notification } from "antd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { format } from "date-fns";

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
  const [isLoading, setIsLoading] = useState(false); // Local loading state

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

  const fetchEvents = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(getEvents({ jwt }));
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchProductsAndCategories = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await dispatch(getCategories({ jwt }));
      setProducts(response || []);
    } finally {
      setIsLoading(false); // Stop loading
    }
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
    setIsLoading(true); // Start loading
    try {
      const response = await dispatch(getEventById({ id, jwt }));
      if (response) {
        setSelectedEvent(response);
      } else {
        console.error("Response không hợp lệ:", response);
      }
      setOpenEditModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
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
    setIsLoading(true); // Start loading
    try {
      await dispatch(deleteEvent({ id: deleteId, jwt }));
      setOpenDeleteModal(false);
      await fetchEvents();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenProductModal = async (eventId) => {
    setIsLoading(true); // Start loading
    try {
      setCurrentEventId(eventId);
      const eventResponse = await dispatch(getEventById({ id: eventId, jwt }));
      if (eventResponse) setSelectedEvent(eventResponse);

      if (eventResponse?.data?.products) {
        setSelectedProducts(new Set(eventResponse.data.products));
      }
      await fetchProductsAndCategories();
      setOpenProductModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setSelectedProducts(new Set());
  };

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

  const updateEventProducts = async (eventId, selectedProductArray) => {
    setIsLoading(true); // Start loading
    try {
      const payload = {
        eventId: eventId,
        products: selectedProductArray,
      };
      const response = await fetch(
        `https://fastfood-online-backend.onrender.com/v1/event/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update products");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating event products:", error);
      return null;
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleSaveProducts = async () => {
    const selectedProductArray = Array.from(selectedProducts);
    const result = await updateEventProducts(
      currentEventId,
      selectedProductArray
    );

    if (result) {
      await fetchEvents();
      handleCloseProductModal();
    }
  };

  const filterProductsForEvent = (category) => {
    return category.products.filter(
      (product) => !product.event || product.event === currentEventId
    );
  };

  const handleBlockUnblock = async (item) => {
    setIsLoading(true); // Start loading
    try {
      if (item.isActive) {
        await dispatch(blockEvent({ id: item._id, jwt }));
        notification.success({ message: "Sự kiện đã bị khóa thành công!" });
      } else {
        await dispatch(unblockEvent({ id: item._id, jwt }));
        notification.success({
          message: "Sự kiện đã được mở khóa thành công!",
        });
      }
      await fetchEvents();
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
            <Table sx={{ minWidth: 650 }} aria-label="Event Table">
              <TableHead sx={{ backgroundColor: "#fdba74" }}>
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Tên sự kiện</TableCell>
                  <TableCell align="center">Giảm giá</TableCell>
                  <TableCell align="right">Ngày hết hạn</TableCell>
                  <TableCell align="center">Hoạt động</TableCell>
                  <TableCell align="center">Hành động</TableCell>
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
                      <TableCell align="right">
                        {item.expDate
                          ? format(new Date(item.expDate), "dd/MM/yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        {item.isActive ? "Hoạt động" : "Khóa"}
                      </TableCell>
                      <TableCell align="center">
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
                            handleOpenFormModal(item._id);
                          }}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleOpenDeleteModal(item._id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenProductModal(item._id)}
                        >
                          <AddBoxIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
          <Box sx={{ ...style, width: 800 }}>
            <Typography variant="h6" mb={2}>
              Chọn sản phẩm cho sự kiện
            </Typography>
            <Box
              sx={{
                maxHeight: 500,
                overflowY: "auto",
                paddingRight: 2,
              }}
            >
              {Array.isArray(categories) &&
                categories.length > 0 &&
                categories.map((category) => (
                  <Box key={category._id} mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      {category.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 2,
                      }}
                    >
                      {filterProductsForEvent(category).map((product) => (
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
                              height: 100,
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
                            onChange={() => {
                              handleToggleProduct(product._id);
                            }}
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
    </Spin>
  );
};

export default EventTable;