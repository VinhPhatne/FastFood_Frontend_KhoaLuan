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

const AdminHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the menu open state

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logged out");
    handleClose(); // Close the menu after logout
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
