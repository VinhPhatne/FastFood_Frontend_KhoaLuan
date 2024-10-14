import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dashboard, ShoppingBag } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";

const menu = [
  { title: "Thông tin tài khoản", icon: <Dashboard />, path: "/" },
  {
    title: "Thay đổi mật khẩu",
    icon: <ShoppingBag />,
    path: "/change-password",
  },
  { title: "Lịch sử đơn hàng", icon: <Dashboard />, path: "/orders" },
];

const ProfileSideBar = () => {
  const [activeItem, setActiveItem] = useState(menu[0].title);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (item) => {
    setActiveItem(item.title);
    navigate(`/profile${item.path}`);
  };

  const userProfile = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  return (
    <div
      className="flex justify-center items-center border-1 border-gray-500 mt-24"
      style={{ height: "500px" }}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 border-2 border-gray-300"
        style={{ color: "#ff7d01" }}
      >
        <div className="text-center mb-4">
          <img
            src="https://via.placeholder.com/80"
            alt="User avatar"
            className="rounded-full mx-auto"
          />
          <h2 className="mt-3 font-bold text-xl">
            XIN CHÀO, {userProfile?.fullname}
          </h2>
          <button className="text-gray-400 mt-1 hover:underline">
            Đăng xuất
          </button>
        </div>

        <Divider className="bg-gray-600" />

        {menu.map((item, i) => (
          <React.Fragment key={item.title}>
            <div
              onClick={() => handleNavigate(item)}
              className={`w-full text-left cursor-pointer py-3 px-4 rounded-lg transition-colors duration-300 ${
                activeItem === item.title
                  ? "bg-orange-400 text-white"
                  : "hover:bg-orange-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </div>
            {i !== menu.length - 1 && <Divider className="bg-gray-600" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProfileSideBar;
