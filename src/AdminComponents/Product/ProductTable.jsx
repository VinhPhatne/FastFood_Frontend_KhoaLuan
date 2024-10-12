import {
  Avatar,
  Box,
  Card,
  CardHeader,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../components/State/Product/Action";

const ProductTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productReducer);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getProducts({ jwt }));
  }, [dispatch]);

  return (
    <Box>
      <Card sx={{ boxShadow: "0 3px 5px rgba(0,0,0,0.1)" }}>
        <CardHeader
          action={
            <IconButton
              onClick={() => navigate("/admin/product/create")}
              aria-label="settings"
            >
              <CreateIcon />
            </IconButton>
          }
          title={"Menu"}
          sx={{
            pt: 2,
            alignItems: "center",
            color: "#fff",
            backgroundColor: "#ff7d01",
          }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
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
                  Ingredients
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Availability
                </TableCell>
                <TableCell align="right" sx={{ color: "#000" }}>
                  Delete
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
                      backgroundColor: index % 2 === 0 ? "#FFF3E0" : "#FFFFFF", // Màu xen kẽ giữa các hàng: cam nhạt và trắng
                      "&:hover": { backgroundColor: "#FFCCBC" }, // Màu khi hover
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
    </Box>
  );
};

export default ProductTable;
