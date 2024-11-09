import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Modal,
  Pagination,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
import { getBills, updateBillStatus } from "../../components/State/Bill/Action";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import socket from "../../components/config/socket"; 

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
  const { bills } = useSelector((state) => state.billReducer);
  const [currentPage, setCurrentPage] = useState(1);
  const jwt = localStorage.getItem("jwt");
  const [stateFilter, setStateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get("accountId");
    const state = params.get("state");
    const phone = params.get("phone");
    params.set("page", value);
    if (state) {
      params.set("state", state);
    }
    if (phone) {
      params.set("phone", phone);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    if (accountId) {
      params.set("accountId", accountId);
    }
    setCurrentPage(value);
    dispatch(
      getBills({
        page: value,
        accountId,
        phone: phone,
        state: state,
      })
    );
  };




  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server via WebSocket in BillTable");
    });
  
    socket.on("billCreated", (response) => {
      console.log("Server response in BillTable:", response);
      handleSearch();
    });
  
    return () => {
      socket.off("connect");
      socket.off("billCreated");
    };
  }, []);
  

  const handleSearch = () => {
    setCurrentPage(1);

    const params = new URLSearchParams(location.search);
    const accountId = params.get("accountId");
    const state = params.get("state");
    console.log("check param", accountId);

    if (searchTerm) {
      params.set("phone", searchTerm);
    } else {
      params.delete("phone");
    }
    if (state) {
      params.set("state", state);
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    dispatch(
      getBills({
        page: 1,
        accountId,
        phone: searchTerm,
        state: state,
      })
    );
  };
  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  const handleRowClick = (id) => {
    navigate(`/admin/bill/${id}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const page = params.get("page") || 1;
    const phone = params.get("phone") || "";
    const state = params.get("state") || "";
    const accountId = params.get("accountId") || ""; 
    console.log("check params:", { page, phone, state, accountId });

    dispatch(
      getBills({
        page,
        accountId,
        phone,
        state,
      })
    );
  }, [dispatch, location.search]);
  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(updateBillStatus(id, newStatus));

      const params = new URLSearchParams(location.search);
      const accountId = params.get("accountId");

      const page = params.get("page") || 1;
      const phone = params.get("phone") || "";
      const state = params.get("state") || "";
      setStateFilter(state);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });

      dispatch(
        getBills({
          page: page,
          accountId: accountId,
          phone: phone,
          state: state,
        })
      );
    } catch (error) {
      console.error("Error updating bill status:", error);
    }
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(location.search);

    params.delete("page");
    params.delete("accountId");
    params.delete("state");
    params.delete("phone");

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    dispatch(
      getBills({
        page: 1,
      })
    );

    setSearchTerm("");
    setStateFilter("");
  };

  const handleStateChange = (event) => {
    const params = new URLSearchParams(location.search);

    params.set("state", event.target.value);

    const page = params.get("page") || 1;
    const phone = params.get("phone") || "";
    const accountId = params.get("accountId") || "";
    const state = params.get("state") || "";
    setStateFilter(event.target.value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    dispatch(
      getBills({
        page: page,
        accountId: accountId,
        phone: phone,
        state: event.target.value,
      })
    );
  };

  return (
    <Box sx={{ width: "95%", margin: "0px auto", marginTop: "100px" }}>
      <Box
        sx={{
          display: "flex",
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
            marginRight: 2, 
          }}
         
        />

        <FormControl variant="outlined" sx={{ width: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={stateFilter}
            onChange={handleStateChange}
            label="Trạng thái"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem value={1}>Đang xử lý</MenuItem>
            <MenuItem value={2}>Đang thực hiện món</MenuItem>
            <MenuItem value={3}>Đang giao hàng</MenuItem>
            <MenuItem value={4}>Hoàn tất</MenuItem>
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
      </Box>

      {/* Table Section */}
      <Card sx={{ boxShadow: "0 3px 5px rgba(0,0,0,0.1)" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Event Table">
            <TableHead sx={{ backgroundColor: "#fdba74" }}>
              <TableRow>
                <TableCell align="left">Id</TableCell>
                <TableCell align="left">Tên người nhận</TableCell>
                <TableCell align="left">Số điện thoại</TableCell>
                <TableCell align="center">Giá trị đơn hàng</TableCell>
                <TableCell align="right">Ngày tạo</TableCell>
                <TableCell align="center">Trạng thái thanh toán</TableCell>
                <TableCell align="center">Trạng thái đơn hàng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(bills.bills) && bills.bills.length > 0 ? (
                bills.bills.map((item, index) => (
                  <TableRow
                    key={item._id}
                    sx={{ "&:hover": { backgroundColor: "#FFF3E0" } }}
                    onClick={() => handleRowClick(item._id)}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{item.fullName}</TableCell>

                    <TableCell align="left">{item.phone_shipment}</TableCell>
                    <TableCell align="center">{item.total_price} đ</TableCell>
                    <TableCell align="right">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {item.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        select
                        value={item.state}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        InputProps={{ readOnly: false }}
                      >
                        <MenuItem value={1} disabled={item.state >= 2}>
                          Đang xử lí
                        </MenuItem>
                        <MenuItem value={2} disabled={item.state >= 3}>
                          Đang thực hiện món
                        </MenuItem>
                        <MenuItem value={3} disabled={item.state === 4}>
                          Đang giao hàng
                        </MenuItem>
                        <MenuItem value={4}>Hoàn tất</MenuItem>
                      </TextField>
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

      {Array.isArray(bills.bills) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={bills.pagination.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default BillTable;
