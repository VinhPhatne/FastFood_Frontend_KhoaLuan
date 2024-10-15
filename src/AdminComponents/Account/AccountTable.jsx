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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { useFormik } from "formik";
import ClearIcon from "@mui/icons-material/Clear";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  getProductsListPage,
} from "../../components/State/Product/Action";
import { getCategories } from "../../components/State/Category/Action";
import { getUsers } from "../../components/State/User/Action";

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

  const { accounts, isLoading } = useSelector((state) => state.userReducer);
  console.log("user", accounts);

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

  return (
    <Box
      sx={{
        width: "95%",
        // display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        margin: "0px auto",
        marginTop: "100px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Tình kiếm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              height: "50px",
            },
          }}
          // InputProps={{
          //   endAdornment: (
          //     <InputAdornment position="end">
          //       <IconButton onClick={handleSearch}>
          //         <SearchIcon />
          //       </IconButton>
          //       <IconButton onClick={() => handleClearSearch()} edge="end">
          //         <ClearIcon />
          //       </IconButton>
          //     </InputAdornment>
          //   ),
          // }}
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
                  Avatar
                </TableCell>
                <TableCell align="left" sx={{ color: "#000" }}>
                  Name
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Phone
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Email
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : Array.isArray(accounts.accounts) &&
                accounts.accounts.length > 0 ? (
                accounts.accounts.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#FFF3E0" },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Avatar src={user.avatar} alt={user.fullname} />
                    </TableCell>
                    <TableCell align="left">{user.fullname}</TableCell>
                    <TableCell align="right">{user.phonenumber}</TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/edit/${user._id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No accounts available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

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
  );
};

export default AccountTable;
