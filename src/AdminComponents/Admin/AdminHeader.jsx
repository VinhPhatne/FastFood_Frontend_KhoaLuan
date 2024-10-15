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

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
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
          onClick={handleMenuClick} // Open the menu on click
        >
          <AccountCircle sx={{ fontSize: "inherit" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl} // Where the menu is anchored
          open={Boolean(anchorEl)} // Menu open state
          onClose={handleClose} // Close menu when clicking outside
        >
          <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
