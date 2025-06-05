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
import { Spin } from "antd"; // Import Spin from antd
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBills, updateBillStatus } from "../../components/State/Bill/Action";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import socket from "../../components/config/socket";
import { notification } from "antd";

const BillTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bills } = useSelector((state) => state.billReducer);
  const [isLoading, setIsLoading] = useState(false); // Local loading state
  const [currentPage, setCurrentPage] = useState(1);
  const jwt = localStorage.getItem("jwt");
  const [stateFilter, setStateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const handlePageChange = async (event, value) => {
    setIsLoading(true); // Start loading
    try {
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
      await dispatch(
        getBills({
          page: value,
          accountId,
          phone: phone,
          state: state,
          jwt,
        })
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server via WebSocket in BillTable");
    });

    socket.on("billCreated", (response) => {
      console.log("Server response in BillTable:", response);
      handleSearch();
      notification.success({ message: "Có đơn hàng mới !!!" });
    });

    return () => {
      socket.off("connect");
      socket.off("billCreated");
    };
  }, []);

  const handleSearch = async () => {
    setIsLoading(true); // Start loading
    try {
      setCurrentPage(1);
      const params = new URLSearchParams(location.search);
      const accountId = params.get("accountId");
      const state = params.get("state");
      if (searchTerm) {
        params.set("phone", searchTerm);
      } else {
        params.delete("phone");
      }
      if (state) {
        params.set("state", state);
      }
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      await dispatch(
        getBills({
          page: 1,
          accountId,
          phone: searchTerm,
          state: state,
          jwt,
        })
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  const handleRowClick = (id) => {
    navigate(`/admin/bill/${id}`);
  };

  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true); // Start loading
      try {
        const params = new URLSearchParams(location.search);
        const page = params.get("page") || 1;
        const phone = params.get("phone") || "";
        const state = params.get("state") || "";
        const accountId = params.get("accountId") || "";
        await dispatch(
          getBills({
            page,
            accountId,
            phone,
            state,
            jwt,
          })
        );
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchBills();
  }, [dispatch, location.search, jwt]);

  const handleStatusChange = async (id, newStatus) => {
    setIsLoading(true); // Start loading
    try {
      await dispatch(updateBillStatus(id, newStatus, jwt));
      const payload = {
        billId: id,
        state: parseInt(newStatus),
      };
      socket.emit("updateOrderStatus", payload);
      const params = new URLSearchParams(location.search);
      const accountId = params.get("accountId");
      const page = params.get("page") || 1;
      const phone = params.get("phone") || "";
      const state = params.get("state") || "";
      setStateFilter(state);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      await dispatch(
        getBills({
          page: page,
          accountId: accountId,
          phone: phone,
          state: state,
          jwt,
        })
      );
      notification.success({
        message: "Cập nhật trạng thái đơn hàng thành công !",
      });
    } catch (error) {
      console.error("Error updating bill status:", error);
      notification.error({
        message: "Cập nhật trạng thái thất bại!",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleClearSearch = async () => {
    setIsLoading(true); // Start loading
    try {
      const params = new URLSearchParams(location.search);
      params.delete("page");
      params.delete("accountId");
      params.delete("state");
      params.delete("phone");
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      await dispatch(
        getBills({
          page: 1,
          jwt,
        })
      );
      setSearchTerm("");
      setStateFilter("");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleStateChange = async (event) => {
    setIsLoading(true); // Start loading
    try {
      const params = new URLSearchParams(location.search);
      params.set("state", event.target.value);
      const page = params.get("page") || 1;
      const phone = params.get("phone") || "";
      const accountId = params.get("accountId") || "";
      const state = event.target.value;
      setStateFilter(state);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      await dispatch(
        getBills({
          page: page,
          accountId: accountId,
          phone: phone,
          state: state,
          jwt,
        })
      );
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
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Tên người nhận</TableCell>
                  <TableCell align="left">Số điện thoại</TableCell>
                  <TableCell align="center">Giá trị đơn hàng</TableCell>
                  <TableCell align="right">Ngày tạo</TableCell>
                  <TableCell align="center">Trạng thái thanh toán</TableCell>
                  <TableCell align="center" width={"300px"}>
                    Trạng thái đơn hàng
                  </TableCell>
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
                      <TableCell align="center">
                        {item.total_price.toLocaleString()} đ
                      </TableCell>
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
                          sx={{
                            "& .MuiSelect-select": {
                              borderRadius: "8px",
                              backgroundColor:
                                item.state === 1
                                  ? "#ff9800"
                                  : item.state === 2
                                  ? "#3f51b5"
                                  : item.state === 3
                                  ? "#4caf50"
                                  : "#607d8b",
                              color: "white",
                              fontWeight: "bold",
                            },
                          }}
                        >
                          <MenuItem
                            value={1}
                            disabled={item.state >= 2}
                            sx={{
                              backgroundColor: "#ff9800",
                              color: "white",
                              borderRadius: "8px",
                            }}
                          >
                            Đang xử lí
                          </MenuItem>
                          <MenuItem
                            value={2}
                            disabled={item.state >= 3}
                            sx={{
                              backgroundColor: "#3f51b5",
                              color: "white",
                              borderRadius: "8px",
                            }}
                          >
                            Đang thực hiện món
                          </MenuItem>
                          <MenuItem
                            value={3}
                            disabled={item.state === 4}
                            sx={{
                              backgroundColor: "#4caf50",
                              color: "white",
                              borderRadius: "8px",
                            }}
                          >
                            Đang giao hàng
                          </MenuItem>
                          <MenuItem
                            value={4}
                            sx={{
                              backgroundColor: "#607d8b",
                              color: "white",
                              borderRadius: "8px",
                            }}
                          >
                            Hoàn tất
                          </MenuItem>
                        </TextField>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
    </Spin>
  );
};

export default BillTable;