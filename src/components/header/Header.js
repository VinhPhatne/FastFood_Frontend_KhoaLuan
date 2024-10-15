import React, { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { FaCartShopping } from "react-icons/fa6";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./Header.module.scss";
import logo from "../../assets/images/logo1.png";
import LoginForm from "../Login/LoginForm";
import RegisterForm from "../Login/RegisterForm";
import { Dropdown, Menu, notification, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../State/Authentication/Action";

const Header = () => {
  const [activeTab, setActiveTab] = useState("Trang chủ");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeForm, setActiveForm] = useState("login");
  const [cart, setCart] = useState([]);
  const jwt = localStorage.getItem("jwt");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedCart = JSON.parse(Cookies.get(jwt) || "[]");
    setCart(savedCart);
  }, [jwt, cart]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [jwt]);

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

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
    if (isLoggedIn) {
      navigate("/cart");
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    notification.success({
      message: "Đăng nhập thành công",
    });
    //window.location.reload();
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
    setIsLoggedIn(false);
    notification.success({
      message: "Đăng xuất thành công",
    });
  };

  const onFinishRegister = (values) => {
    console.log("Register Success:", values);
    setIsModalVisible(false);
  };

  const handleSwitchToRegister = () => setActiveForm("register");
  const handleSwitchToLogin = () => setActiveForm("login");

  const menuItems = [
    { label: "Menu" },
    { label: "Khuyến Mãi" },
    { label: "Giới thiệu" },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item
        key="profile"
        onClick={() => navigate("/profile/change-password")}
      >
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

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
                onClick={() => setActiveTab(item.label)}
              >
                {item.label}
              </li>
            ))}
        </ul>
      </div>

      <div className={styles.action}>
        <div className={styles.search}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div className={styles.cart} onClick={handleCartClick}>
          <FaCartShopping />
          <span className={styles.cartBadge}>{totalQuantity}</span>
        </div>

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
        {/* <Button
          className={`${styles.btn} ${styles["btn-student"]}`}
          onClick={handleLoginClick}
        >
          Đăng nhập
        </Button> */}
      </div>

      {/* <LoginForm
        isModalVisible={isModalVisible && !isRegisterMode}
        handleCancel={handleCancel}
        //onFinish={onFinish}
        handleLoginSuccess={handleLoginSuccess}
        switchToRegister={switchToRegister}
      />

      <RegisterForm
        isModalVisible={isModalVisible && isRegisterMode}
        handleCancel={handleCancel}
        onFinish={onFinishRegister}
        switchToLogin={switchToLogin}
      /> */}

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
