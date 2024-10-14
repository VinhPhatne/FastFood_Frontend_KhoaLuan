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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import ClearIcon from "@mui/icons-material/Clear";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  getProductsListPage,
} from "../../components/State/Product/Action";

const ProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { products } = useSelector((state) => state.productReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    const jwt = localStorage.getItem("jwt");
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    navigate(`?${params.toString()}`);
    dispatch(getProductsListPage({ jwt, search: searchTerm }));
  };
  const handleClearSearch = () => {
    setSearchTerm(""); 
    const jwt = localStorage.getItem("jwt");
    searchParams.delete("search");
    setSearchParams(searchParams);
    const search = ""
    const page = 1
    setCurrentPage(page);
    dispatch(getProductsListPage({ jwt, page, search }));
  };

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      params.set("search", search);
    }
    setCurrentPage(value);
    setSearchParams(params.toString());
    const jwt = localStorage.getItem("jwt");
    dispatch(getProductsListPage({ jwt, page: value, search }));
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const pageFromParams = searchParams.get("page");
    const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
    setCurrentPage(page);
    dispatch(getProductsListPage({ jwt, page }));
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
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={() => handleClearSearch()} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("create")}
        >
          Thêm mới
        </Button>
      </Box>
      <Card sx={{ boxShadow: "0 3px 5px rgba(0,0,0,0.1)" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{
                backgroundColor: "#fdba74", // Set background color to #FFF3E0
              }}
            >
              {" "}
              {/* Đổi màu nền TableHead thành cam Popeyes */}
              <TableRow>
                <TableCell align="left" sx={{ color: "#000" }}>
                  Image
                </TableCell>{" "}
                {/* Đổi màu chữ thành trắng */}
                <TableCell align="left" sx={{ color: "#000" }}>
                  Name
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Current Price
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Category
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  isSell
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(products.products) &&
              products.products.length > 0 ? (
                products.products.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      // backgroundColor: index % 2 === 0 ? "#FFF3E0" : "#FFFFFF", // Màu xen kẽ giữa các hàng: cam nhạt và trắng
                      "&:hover": { backgroundColor: "#FFF3E0" }, // Màu khi hover
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <img
                        src={item.picture}
                        alt={item.name}
                        style={{
                          width: "100px", // Đặt chiều rộng
                          height: "auto", // Tự động tính chiều cao theo tỷ lệ
                          objectFit: "cover", // Giữ nguyên tỷ lệ và cắt ảnh nếu cần
                          borderRadius: "8px", // Bo tròn góc ảnh (nếu muốn)
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{item.name}</TableCell>
                    <TableCell align="right">{item.price} VND</TableCell>
                    <TableCell align="right">{item.currentPrice} VND</TableCell>
                    <TableCell align="right">{item.category.name} </TableCell>
                    <TableCell align="right">
                      {item.isSelling ? (
                        <span style={{ color: "#43A047" }}>Selling</span>
                      ) : (
                        <span style={{ color: "#D32F2F" }}>Block</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="error">
                        <Edit />
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <p style={{ padding: "16px" }}>No products available</p>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {Array.isArray(products.products) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={products.pagination.totalPages} 
            page={currentPage}
            onChange={handlePageChange} // Xử lý khi thay đổi trang
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductTable;
