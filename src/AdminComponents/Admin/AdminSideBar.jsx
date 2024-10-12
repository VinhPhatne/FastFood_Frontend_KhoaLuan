import { Dashboard, ShoppingBag } from "@mui/icons-material";
import React, { useState } from "react";
import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import CategoryIcon from "@mui/icons-material/Category";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import EventIcon from "@mui/icons-material/Event";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { logout } from "../../component/State/Authentication/Action";

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "/" },
  { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
  { title: "Product", icon: <ShopTwoIcon />, path: "/product" },
  { title: "Food Category", icon: <CategoryIcon />, path: "/category" },
  { title: "Ingredients", icon: <FastfoodIcon />, path: "/ingredients" },
  { title: "Events", icon: <EventIcon />, path: "/event" },
  { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/details" },
  { title: "Logout", icon: <LogoutIcon />, path: "/" },
];

const AdminSideBar = ({ handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const [activeItem, setActiveItem] = useState(menu[0].title); // Set the default active item
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    setActiveItem(item.title); // Update active item
    navigate(`/admin${item.path}`);
    if (item.title === "Logout") {
      // dispatch(logout());
      handleClose();
    }
  };

  return (
    <div>
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        onClose={handleClose}
        open={true}
        anchor="left"
        sx={{ zIndex: 1, backgroundColor: "#FAF3E0", marginTop: "20px" }}
      >
        <div className="w-[70vw] lg:w-[14vw] h-screen flex flex-col justify-center text-l space-y-[1rem]">
          {menu.map((item, i) => (
            <React.Fragment key={item.title}>
              <div
                onClick={() => handleNavigate(item)}
                className={`px-5 flex items-center gap-5 cursor-pointer text-orange-700 py-3 rounded transition-colors duration-300 mt-20 ${
                  activeItem === item.title ? "bg-orange-300 text-orange-900" : "hover:bg-orange-300 hover:text-orange-900"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
              {i !== menu.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Drawer>
    </div>
  );
};

export default AdminSideBar;
