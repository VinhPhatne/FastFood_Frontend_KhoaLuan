import {
  Box,
  Card,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getBills } from "../../components/State/Bill/Action";

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

const Bill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bills } = useSelector((state) => state.billReducer);
  const [currentPage, setCurrentPage] = useState(1);
  const jwt = localStorage.getItem("jwt");

  const [searchTerm, setSearchTerm] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get("accountId");

    if (accountId) {
      params.set("accountId", accountId);
    }
    setCurrentPage(value);

    dispatch(
      getBills({
        page: value,
        accountId,
      })
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);

    const params = new URLSearchParams(location.search);
    const accountId = params.get("accountId");
    if (searchTerm) {
      params.set("phone", searchTerm);
    }

    dispatch(getBills(1, accountId, searchTerm));
  };

  const [searchParams] = useSearchParams();

  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  const handleRowClick = (id) => {
    navigate(`/profile/orders/bill/${id}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get("accountId");
    dispatch(getBills({ page: 1, accountId }));
  }, [dispatch]);

  const handleClearSearch = () => setSearchTerm("");

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "50px",
        marginLeft: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      {/* <Box
        sx={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "start",
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
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box> */}

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

export default Bill;
