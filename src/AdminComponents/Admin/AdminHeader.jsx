import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import logo from "../../assets/images/logo1.png";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../components/State/Authentication/Action";
import { useCartContext } from "../../components/cart/CartContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const cartContext = useCartContext();
  if (!cartContext) {
    console.error("CartContext is not available.");
  }
  const { clearCart } = cartContext || {};

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearCart();
    navigate("/");
    dispatch(logout());
    notification.success({
      message: "Đăng xuất thành công",
    });
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#ff7d01",
        zIndex: 1201,
        width: "100%",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography variant="h6" component="div">
            Admin
          </Typography>
        </div>
        <IconButton
          color="inherit"
          sx={{ fontSize: "30px" }}
          onClick={handleMenuClick} 
        >
          <AccountCircle sx={{ fontSize: "inherit" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)}
          onClose={handleClose} 
        >
          <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
