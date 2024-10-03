import React, { useState } from "react";
import { Button } from "@mantine/core";
import { FaCartShopping } from "react-icons/fa6";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./Header.module.scss";
import logo from "../../assets/images/logo.jpg";
import LoginForm from "../Login/LoginForm";
import RegisterForm from "../Login/RegisterForm";

const Header = () => {
  const [activeTab, setActiveTab] = useState("Trang chủ");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
    setIsModalVisible(false);
  };

  const onFinishRegister = (values) => {
    console.log("Register Success:", values);
    setIsModalVisible(false);
  };

  const switchToRegister = () => {
    setIsRegisterMode(true);
  };

  const switchToLogin = () => {
    setIsRegisterMode(false);
  };

  const menuItems = [
    { label: "Thể loại" },
    { label: "Chuyên gia" },
    { label: "Giới thiệu" },
  ];

  return (
    <div className={styles.header}>
      <div>
        <img src={logo} alt="" />
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
            placeholder="Nhập tên khoá học"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div className={styles.cart}>
          <FaCartShopping />
          <span className={styles.cartBadge}>0</span>
        </div>
        <Button
          className={`${styles.btn} ${styles["btn-student"]}`}
          onClick={handleLoginClick}
        >
          Đăng nhập
        </Button>
      </div>

      <LoginForm
        isModalVisible={isModalVisible && !isRegisterMode} 
        handleCancel={handleCancel}
        onFinish={onFinish}
        switchToRegister={switchToRegister}
      />

      <RegisterForm
        isModalVisible={isModalVisible && isRegisterMode} 
        handleCancel={handleCancel}
        onFinish={onFinishRegister}
        switchToLogin={switchToLogin} 
      />
    </div>
  );
};

export default Header;
