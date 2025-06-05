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
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  Typography,
} from "@mui/material";
import { Spin } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../../components/State/User/Action";
import UpdateAccountForm from "./UpdateAccountForm";
import CreateAccountForm from "./CreateAccountForm";

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

const AccountTable = () => {
  const jwt = localStorage.getItem("jwt");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [open, setOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { accounts, isLoading } = useSelector((state) => state.userReducer);

  const fetchAccounts = () => {
    dispatch(getUsers({ jwt, page: currentPage }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    const jwt = localStorage.getItem("jwt");
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    if (selectedRole) {
      params.set("role", selectedRole);
    }
    if (selectedStatus) {
      params.set("status", selectedStatus);
    }
    navigate(`?${params.toString()}`);
    dispatch(
      getUsers({
        jwt,
        search: searchTerm,
        role: selectedRole,
        state: selectedStatus,
      })
    );
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedRole("");
    const jwt = localStorage.getItem("jwt");
    searchParams.delete("role");
    searchParams.delete("search");
    searchParams.delete("status");
    setSearchParams(searchParams);
    dispatch(getUsers({ jwt, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const role = params.get("role");
    setCurrentPage(value);
    setSearchParams(params.toString());
    const jwt = localStorage.getItem("jwt");
    dispatch(getUsers({ jwt, page: value || 1, search, role }));
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const pageFromParams = searchParams.get("page");
    const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
    setCurrentPage(page);
    dispatch(getUsers({ jwt, page }));
  }, [dispatch]);

  const handleOpenFormModal = async (id) => {
    const response = await dispatch(getUserById({ id, jwt }));
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
    await dispatch(deleteUser({ id: deleteId, jwt }));
    setOpenDeleteModal(false);
    fetchAccounts();
  };

  const handleOpen = () => setOpen(true);

  return (
    <Spin spinning={isLoading} size="large">
      <Box
        sx={{
          width: "95%",
          justifyContent: "center",
          alignItems: "center",
          margin: "0px auto",
          marginTop: "100px",
          minHeight: "100vh",
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
            <InputLabel>Role</InputLabel>
            <Select value={selectedRole} onChange={handleRoleChange} label="Role">
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="1">Admin</MenuItem>
              <MenuItem value="3">User</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
            <InputLabel>Trạng thái tài khoản</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Hoạt động</MenuItem>
              <MenuItem value="false">Bị Block</MenuItem>
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
            onClick={() => handleOpen()}
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
                    Avatar
                  </TableCell>
                  <TableCell align="left" sx={{ color: "#000" }}>
                    Họ và tên
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Số điện thoại
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Địa chỉ
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Email
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#000" }}>
                    Trạng thái
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#000" }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(accounts.accounts) &&
                accounts.accounts.length > 0 ? (
                  accounts.accounts.map((user) => (
                    <TableRow
                      key={user._id}
                      onClick={() =>
                        navigate(`/admin/bill?accountId=${user._id}`)
                      }
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#FFF3E0" },
                        cursor: "pointer",
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar src={user.avatar} alt={user.fullname} />
                      </TableCell>
                      <TableCell align="left">{user.fullname}</TableCell>
                      <TableCell align="right">{user.phonenumber}</TableCell>
                      <TableCell align="right">{user.address}</TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            color: user.state === true ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {user.state === true ? "Hoạt động" : "Khóa"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenFormModal(user._id);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteModal(user._id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No accounts available
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
            <UpdateAccountForm
              onSuccess={fetchAccounts}
              account={selectedEvent}
              onClose={handleCloseFormModal}
            />
          </Box>
        </Modal>

        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <Box sx={style}>
            <Typography variant="h6">Xác nhận khóa</Typography>
            <Typography>Bạn có chắc chắn muốn khóa tài khoản này không?</Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
              <Button variant="contained" color="primary" onClick={handleDelete}>
                Xóa
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <CreateAccountForm
              onSuccess={fetchAccounts}
              onClose={() => setOpen(false)}
            />
          </Box>
        </Modal>

        {Array.isArray(accounts.accounts) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              count={accounts.pagination?.totalPages || 1}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Spin>
  );
};

export default AccountTable;