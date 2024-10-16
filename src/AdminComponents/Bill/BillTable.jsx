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
import { getBills } from "../../components/State/Bill/Action";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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

const BillTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bills } = useSelector((state) => state.billReducer.bills);
  console.log("bills", bills);
  const jwt = localStorage.getItem("jwt");

  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(location.search);
    const search = params.get("search");

  const handleRowClick = (id) => {
    navigate(`/admin/bill/${id}`);
  };

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  // useEffect(() => {
  //   const filtered = bills?.filter((item) =>
  //     item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredBills(filtered || []);
  // }, [bills, searchTerm]);

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
                <TableCell align="left">Tên người nhận</TableCell>
                <TableCell align="center">Giá trị đơn hàng</TableCell>
                <TableCell align="right">Ngày tạo</TableCell>
                <TableCell align="center">Trạng thái thanh toán</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(bills) && bills.length > 0 ? (
                bills.map((item, index) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:hover": { backgroundColor: "#FFF3E0" } }}
                    onClick={() => handleRowClick(item._id)}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{item.fullName}</TableCell>
                    <TableCell align="center">{item.total_price} đ</TableCell>
                    <TableCell align="right">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {item.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
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
                      <IconButton
                        color="error"
                        onClick={() => {
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
                    <Typography>No bills available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal Section */}
      {/* <Modal open={openEditModal} onClose={handleCloseFormModal}>
        <Box sx={style}>
          <UpdateEventForm
            event={selectedEvent}
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
          <CreateEventForm onClose={() => setOpen(false)} />
        </Box>
      </Modal> */}
    </Box>
  );
};

export default BillTable;
