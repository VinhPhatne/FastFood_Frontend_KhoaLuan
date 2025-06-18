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
import { Spin } from "antd"; // Import Spin from antd
import CreateIcon from "@mui/icons-material/Create";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVoucher,
  getVoucherById,
  getVouchers,
} from "../../components/State/voucher/Action";
import { Delete } from "@mui/icons-material";
import UpdateVoucherForm from "./UpdateVoucherForm";
import CreateVoucherForm from "./CreateVoucherForm";

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

const VoucherTable = () => {
  const dispatch = useDispatch();
  const vouchers = useSelector((state) => state.voucherReducer?.voucher || []);
  const [isLoading, setIsLoading] = useState(false); // Local loading state

  const jwt = localStorage.getItem("jwt");

  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchVouchers = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(getVouchers({ jwt }));
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [dispatch, jwt]);

  useEffect(() => {
    const filtered = vouchers?.voucher?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered || []);
  }, [vouchers, searchTerm]);

  const handleClearSearch = () => setSearchTerm("");

  const handleOpenFormModal = async (id) => {
    setIsLoading(true); // Start loading
    try {
      const response = await dispatch(getVoucherById({ id, jwt }));
      if (response) {
        setSelectedVoucher(response);
      } else {
        console.error("Response không hợp lệ:", response);
      }
      setOpenEditModal(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCloseFormModal = () => {
    setSelectedVoucher(null);
    setOpenEditModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(deleteVoucher({ id: deleteId, jwt }));
      setOpenDeleteModal(false);
      await fetchVouchers();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            sx={{ ml: 2 }}
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
                  <TableCell align="left">Mã voucher</TableCell>
                  <TableCell align="left">Tên voucher</TableCell>
                  <TableCell align="center">Giảm giá</TableCell>
                  <TableCell align="center" sx={{ color: "#000" }}>
                    Trạng thái
                  </TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
               {Array.isArray(vouchers.voucher) &&
              vouchers.voucher.length > 0 ? (
                vouchers.voucher.map((item, index) => (
                    <TableRow
                      key={item._id}
                      sx={{ "&:hover": { backgroundColor: "#FFF3E0" } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.code}
                      </TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="center">{item.discount.toLocaleString()} đ</TableCell>
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
                    <TableCell colSpan={5} align="center">
                      <Typography>No Voucher available</Typography>
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
            <UpdateVoucherForm
              onSuccess={fetchVouchers}
              voucher={selectedVoucher}
              onClose={handleCloseFormModal}
            />
          </Box>
        </Modal>

        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <Box sx={style}>
            <Typography variant="h6">Xác nhận xóa</Typography>
            <Typography>Bạn có chắc chắn muốn xóa voucher này không?</Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
              <Button onClick={handleDelete}>Xóa</Button>
            </Box>
          </Box>
        </Modal>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <CreateVoucherForm
              onSuccess={fetchVouchers}
              onClose={() => setOpen(false)}
            />
          </Box>
        </Modal>
      </Box>
    </Spin>
  );
};

export default VoucherTable;