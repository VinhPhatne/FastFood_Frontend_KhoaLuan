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
import { useDispatch } from "react-redux";
import { logout } from "../../components/State/Authentication/Action";
import DiscountIcon from "@mui/icons-material/Discount";
import { useCartContext } from "../../components/cart/CartContext";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListIcon from '@mui/icons-material/List';
// import { logout } from "../../component/State/Authentication/Action";

const menu = [
  { title: "Doanh thu", icon: <Dashboard />, path: "/" },
  { title: "Hóa đơn", icon: <ShoppingBag />, path: "/bill" },
  { title: "Tài khoản", icon: <AccountBoxIcon />, path: "/account" },
  { title: "Sản phẩm", icon: <ShopTwoIcon />, path: "/product" },
  { title: "Danh mục", icon: <CategoryIcon />, path: "/category" },
  { title: "Sự kiện", icon: <EventIcon />, path: "/event" },
  { title: "Voucher", icon: <DiscountIcon />, path: "/voucher" },
  { title: "Nhập hàng", icon: <InventoryIcon />, path: "/import" },
  { title: "Tuỳ chọn món ăn", icon: <ListIcon />, path: "/optional" },
  { title: "Đăng xuất", icon: <LogoutIcon />, path: "/" },
];

const AdminSideBar = ({ handleClose }) => {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const [activeItem, setActiveItem] = useState(menu[0].title);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clearCart } = useCartContext();

  const handleNavigate = (item) => {
    setActiveItem(item.title);
    navigate(`/admin${item.path}`);
    if (item.title === "Đăng xuất") {
      clearCart();
      navigate("/");
      dispatch(logout());
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
        sx={{ backgroundColor: "#FAF3E0", marginTop: "20px" }}
      >
        <div className="w-[70vw] lg:w-[14vw] h-screen flex flex-col text-l space-y-[0.8rem]">
          {menu.map((item, i) => (
            <React.Fragment key={item.title}>
              <div
                onClick={() => handleNavigate(item)}
                className={`px-5 flex items-center gap-5 cursor-pointer text-orange-700 py-3 rounded transition-colors duration-300 mt-20 ${
                  activeItem === item.title
                    ? "bg-orange-300 text-orange-900"
                    : "hover:bg-orange-300 hover:text-orange-900"
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
