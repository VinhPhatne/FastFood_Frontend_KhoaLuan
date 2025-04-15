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
import { Delete } from "@mui/icons-material";
import UpdateStockInForm from "./UpdateStockInForm";
import CreateStockInForm from "./CreateStockInForm";
import {
  deleteIngredient,
  getIngredient,
  getIngredientById,
} from "../../components/State/Import/Action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};

const StockInTable = () => {
  const dispatch = useDispatch();
  const { ingredients } = useSelector(
    (state) => state.ingredientReducer.ingredients
  );

  const jwt = localStorage.getItem("jwt");

  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchIngredient = () => {
    dispatch(getIngredient({ jwt }));
  };

  useEffect(() => {
    fetchIngredient();
  }, [dispatch, jwt]);

  useEffect(() => {
    const filtered = ingredients?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered || []);
  }, [ingredients, searchTerm]);

  const handleClearSearch = () => setSearchTerm("");

  const handleOpenFormModal = async (id) => {
    const response = await dispatch(getIngredientById({ id }));
    console.log("response", response);
    if (response) {
      setSelectedEvent(response.ingredient);
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
    await dispatch(deleteIngredient({ id: deleteId, jwt }));
    setOpenDeleteModal(false);
    fetchIngredient();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                <TableCell align="left">Tên</TableCell>
                <TableCell align="center">Số lượng</TableCell>
                <TableCell align="center">Đơn vị</TableCell>
                <TableCell align="center">Giá tiền</TableCell>
                <TableCell align="right">Hành động</TableCell>
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
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">{item.unit}</TableCell>
                    <TableCell align="center">{item.price.toLocaleString()}</TableCell>
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography>No ingredients available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal Section */}
      <Modal open={openEditModal} onClose={handleCloseFormModal}>
        <Box sx={style}>
          <UpdateStockInForm
            event={selectedEvent}
            onSuccess={fetchIngredient}
            onClose={handleCloseFormModal}
          />
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={style}>
          <Typography variant="h6">Xác nhận xóa</Typography>
          <Typography>Bạn có chắc chắn muốn xóa đơn nhập hàng này không?</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
            <Button onClick={handleDelete}>Xóa</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <CreateStockInForm
            onSuccess={fetchIngredient}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default StockInTable;
