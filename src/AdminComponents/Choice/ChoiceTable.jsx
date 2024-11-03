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
import { blockEvent, unblockEvent } from "../../components/State/Event/Action";
import { Delete } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { notification } from "antd";
import CreateOptionalForm from "./CreateChoiceForm";
import UpdateOptionalForm from "./UpdateChoiceForm";
import { useNavigate, useParams } from "react-router-dom";
import { deleteChoice, getChoiceById, getChoicesByOptionalId } from "../../components/State/Choice/Action";

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

const ChoiceTable = () => {
  const dispatch = useDispatch();
  const { optionalId } = useParams(); 
  const { choices } = useSelector((state) => state.choiceReducer.choices);

  const jwt = localStorage.getItem("jwt");

  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEvents = async () => {
    await dispatch(getChoicesByOptionalId({ optionalId, jwt }));
  };

  // useEffect(() => {
  //   fetchEvents();
  // }, [dispatch, jwt]);

  useEffect(() => {
    if (optionalId) {
      dispatch(getChoicesByOptionalId({ optionalId, jwt }));
    }
  }, [dispatch, optionalId, jwt]);

  useEffect(() => {
    const filtered = choices?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered || []);
  }, [choices, searchTerm]);

  const handleClearSearch = () => setSearchTerm("");

  const handleOpenFormModal = async (id) => {
    const response = await dispatch(getChoiceById({ id, jwt }));
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
    await dispatch(deleteChoice({ id: deleteId, jwt }));
    setOpenDeleteModal(false);
    fetchEvents();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlockUnblock = async (item) => {
    try {
      if (item.isActive) {
        const response = await dispatch(blockEvent({ id: item._id, jwt }));
        notification.success({ message: "Sản phẩm đã bị khóa thành công!" });
      } else {
        const response = await dispatch(unblockEvent({ id: item._id, jwt }));
        notification.success({
          message: "Sản phẩm đã được mở khóa thành công!",
        });
      }
      fetchEvents();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      console.error(error);
      notification.error({ message: errorMessage });
    }
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
                <TableCell align="center">Giá bổ sung</TableCell>
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
                      {(item.additionalPrice).toLocaleString()} đ
                    </TableCell>
                    <TableCell align="right">{item.additionalPrice}</TableCell>
                    <TableCell align="center">
                      {item.isActive ? "Active" : "Inactive"}
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
                    <Typography>No optionals available</Typography>
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
          <UpdateOptionalForm
            event={selectedEvent}
            onSuccess={fetchEvents}
            onClose={handleCloseFormModal}
          />
        </Box>
      </Modal>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={style}>
          <Typography variant="h6">Xác nhận xóa</Typography>
          <Typography>Bạn có chắc chắn muốn xóa lựa chọn này không?</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
            <Button onClick={handleDelete}>Xóa</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <CreateOptionalForm
            onSuccess={fetchEvents}
            onClose={() => setOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default ChoiceTable;