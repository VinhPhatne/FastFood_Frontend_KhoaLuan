
import React, { useEffect, useState, useRef } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { Button } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./Header.module.scss";
import logo from "../../assets/images/logo1.png";
import LoginForm from "../Login/LoginForm";
import RegisterForm from "../Login/RegisterForm";
import { Dropdown, Menu, notification, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, logout } from "../State/Authentication/Action";
import { GiTwoCoins } from "react-icons/gi";
import useCart from "../../hook/useCart";
import { useCartContext } from "../cart/CartContext";
import axios from "axios";
import socket from "../config/socket";
import {
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LoginOutlined,
  SettingOutlined,
  SlidersOutlined,
  TranslationOutlined,
  UserOutlined,
  CommentOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ReactComponent as IconDoubleCheck } from '../../assets/icon/doubleCheck.svg';
import classNames from 'classnames';

const Header = () => {
  const [activeTab, setActiveTab] = useState("Trang chủ");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeForm, setActiveForm] = useState("login");
  const { cart } = useCart();
  const { clearCart } = useCartContext();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.auth.user);

  useEffect(() => {
    const quantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(quantity);
  }, [cart]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("https://fastfood-online-backend.onrender.com/v1/order-notify/list", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : [];
          setNotifications(data);
          setNotificationCount(data.filter((n) => !n.isRead).length);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([])
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get("https://fastfood-online-backend.onrender.com/v1/review/list", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = Array.isArray(response.data) ? response.data : [];
        setReviews(data);
        setReviewCount(data.filter((r) => !r.isRead).length);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    if (jwt) {
      fetchNotifications();
      fetchReviews();
      dispatch(getUserProfile());
    }
  }, [dispatch, jwt]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server via WebSocket");
    });

    socket.on("order_notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setNotificationCount((prev) => prev + 1);
      notification.success({
        message: "Thông báo mới",
        description: newNotification.message || "Bạn có thông báo mới!",
      });
    });

    socket.on("review_notification", (newReview) => {
      setReviews((prev) => [newReview, ...prev]);
      setReviewCount((prev) => prev + 1);
      notification.success({
        message: "Review mới",
        description: newReview.message || "Bạn có review mới!",
      });
    });

    return () => {
      socket.off("connect");
      socket.off("order_notification");
      socket.off("review_notification");
    };
  }, []);

  useEffect(() => {
    if (jwt) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [jwt]);

  const handleFocus = () => {
    setIsSearchActive(true);
  };

  const handleBlur = () => {
    setIsSearchActive(false);
  };

  const handleLoginClick = () => {
    setIsModalVisible(true);
    setIsRegisterMode(false);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    clearCart();
    navigate("/");
    dispatch(logout());
    setIsLoggedIn(false);
    notification.success({
      message: "Đăng xuất thành công",
    });
  };

  const handleSwitchToRegister = () => setActiveForm("register");
  const handleSwitchToLogin = () => setActiveForm("login");

  const menuItems = [
    { label: "Menu", path: "/" },
    { label: "Khuyến Mãi", path: "/promotion" },
    { label: "Giới thiệu", path: "/about" },
  ];

  const userMenu = (
    <Menu>
      {userProfile?.role === 1 && (
        <Menu.Item key="admin" onClick={() => navigate("/admin")}>
          Trang Admin
        </Menu.Item>
      )}
      {userProfile?.role === 2 && (
        <Menu.Item key="manager" onClick={() => navigate("/manager")}>
          Trang Manager
        </Menu.Item>
      )}
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Tài khoản
      </Menu.Item>
      <Menu.Item
        key="change-password"
        onClick={() => navigate("/profile/change-password")}
      >
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  const [ isNotiOpen, setIsNotiOpen ] = useState(false);
  const notiContentRef = useRef(null);
  const bellRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
      if (
          bellRef.current &&
          !bellRef.current.contains(event.target) &&
          notiContentRef.current &&
          !notiContentRef.current.contains(event.target) &&
          isNotiOpen
      ) {
          setIsNotiOpen(false);
      }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
      document.removeEventListener('mousedown', handleClickOutside);
  };
}, [ isNotiOpen ]);

  return (
    <div className={styles.header}>
      <div>
        <img src={logo} alt="" onClick={() => navigate("/")} />
      </div>

      <div className={styles.menu}>
        <ul>
          {!isSearchActive &&
            menuItems.map((item) => (
              <li
                key={item.label}
                className={activeTab === item.label ? styles.active : ""}
                onClick={() => {
                  setActiveTab(item.label);
                  navigate(item.path);
                }}
              >
                {item.label}
              </li>
            ))}
        </ul>
      </div>

      <div className={styles.action}>
        <div className={styles.cart} onClick={handleCartClick}>
          <FaCartShopping />
          <span className={styles.cartBadge}>{totalQuantity}</span>
        </div>

        {isLoggedIn && userProfile && (
          <div className={styles.points}>
            <span className={styles.pointsText}>{userProfile.point || 0}</span>
            <GiTwoCoins className={styles.coinIcon} />
          </div>
        )}

        {isLoggedIn ? (
          <div className={styles.userProfile}>
            <Dropdown overlay={userMenu}>
              <a onClick={(e) => e.preventDefault()}>
                <Avatar
                  src={"https://example.com/avatar.jpg"}
                  icon={isLoggedIn && <UserOutlined />}
                  className={styles.avatar}
                  shape="circle"
                  size="large"
                />
              </a>
            </Dropdown>
          </div>
        ) : (
          <Button
            className={`${styles.btn} ${styles["btn-student"]}`}
            onClick={handleLoginClick}
          >
            Đăng nhập
          </Button>
        )}
      </div>

      {activeForm === "login" ? (
        <LoginForm
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          switchToRegister={handleSwitchToRegister}
        />
      ) : (
        <RegisterForm
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          switchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
};

export default Header;