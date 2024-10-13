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
  InputAdornment ,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { Delete, Edit  } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../components/State/Product/Action";

const ProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getProducts({ jwt }));
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
          justifyContent: "space-between", // Space between search and button
          alignItems: "center", // Center items vertically
          marginBottom: "20px", // Space below the search and button
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", // Change this value to adjust border radius
              height: "40px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={() => console.log("Add New clicked")}>
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
                  Title
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Availability
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
              {Array.isArray(products) && products.length > 0 ? (
                products.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      // backgroundColor: index % 2 === 0 ? "#FFF3E0" : "#FFFFFF", // Màu xen kẽ giữa các hàng: cam nhạt và trắng
                      "&:hover": { backgroundColor: "#FFF3E0" }, // Màu khi hover
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {/* <Avatar src={item.images[0]} /> */}
                    </TableCell>
                    <TableCell align="left">{item.name}</TableCell>
                    <TableCell align="right">
                      {/* {item.ingredients.map((ingredient) => (
                        <Chip label={ingredient.name} />
                      ))} */}
                    </TableCell>
                    <TableCell align="right">{item.price} VND</TableCell>
                    <TableCell align="right">
                      {item.isStock ? (
                        <span style={{ color: "#43A047" }}>In stock</span>
                      ) : (
                        <span style={{ color: "#D32F2F" }}>Out of stock</span>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="error">
                        <Edit/>
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
      <div
        style={{ padding: "16px", display: "flex", justifyContent: "flex-end" }}
      >
        <Button variant="outlined" color="primary">
          List Page
        </Button>
      </div>
    </Box>
  );
};

export default ProductTable;
