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
  getProductById,
  getProducts,
  getProductsListPage,
} from "../../components/State/Product/Action";
import { getCategories } from "../../components/State/Category/Action";

const ProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { categories } = useSelector(
    (state) => state.categoryReducer.categories
  );
  const { products } = useSelector((state) => state.productReducer);
  const jwt = localStorage.getItem("jwt");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSell, setIsSell] = useState("");

  const handleSearch = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    const jwt = localStorage.getItem("jwt");
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    if (isSell) {
      params.set("isSell", isSell);
    }
    navigate(`?${params.toString()}`);
    dispatch(
      getProductsListPage({
        jwt,
        search: searchTerm,
        cateId: selectedCategory,
        isSelling: isSell,
      })
    );
  };
  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setIsSell("");
    const jwt = localStorage.getItem("jwt");
    searchParams.delete("category");
    searchParams.delete("search");
    searchParams.delete("isSell");
    setSearchParams(searchParams);
    const search = "";
    const page = 1;
    setCurrentPage(page);
    dispatch(getProductsListPage({ jwt, page, search }));
  };
  const handleIsSellChange = (event) => {
    setIsSell(event.target.value);
  };

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const cateId = params.get("category");
    const isSell = params.get("isSell");
    if (search) {
      params.set("search", search);
    }
    if (cateId) {
      params.set("category", cateId);
    }
    if (isSell) {
      params.set("isSell", isSell);
    }
    setCurrentPage(value);
    setSearchParams(params.toString());
    const jwt = localStorage.getItem("jwt");
    dispatch(
      getProductsListPage({
        jwt,
        page: value,
        search,
        cateId,
        isSelling: isSell,
      })
    );
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    const pageFromParams = searchParams.get("page");
    const page = pageFromParams ? parseInt(pageFromParams, 10) : currentPage;
    setCurrentPage(page);
    dispatch(getProductsListPage({ jwt, page }));
    dispatch(getCategories({ jwt }));
  }, [dispatch, jwt]);

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
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            {/* <MenuItem value="">All Categories</MenuItem> */}
            {Array.isArray(categories) &&
              categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150, marginLeft: 2 }}>
          <InputLabel>Trạng thái bán</InputLabel>
          <Select
            value={isSell}
            onChange={handleIsSellChange}
            label="Trạng thái bán"
          >
            <MenuItem value={true}>Đang bán</MenuItem>
            <MenuItem value={false}>Ngừng bán</MenuItem>{" "}
            {/* False: Ngừng bán */}
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
        {/* ),
          }} */}

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
                          width: "100px", 
                          height: "auto",
                          objectFit: "cover", 
                          borderRadius: "8px", 
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
                      <IconButton
                        color="error"
                        // onClick={() => {
                        //   console.log("IDDDD", item._id);
                        //   //handleUpdate(item._id);
                        // }}

                        onClick={() => navigate(`${item._id}`)}
                      >
                        <CreateIcon />
                      </IconButton>
                      {/* <IconButton
                        color="error"
                        onClick={() => {
                          console.log("IDDDD", item._id);
                          handleOpenDeleteModal(item._id);
                        }}
                      >
                        <Delete />
                      </IconButton> */}
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
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductTable;
