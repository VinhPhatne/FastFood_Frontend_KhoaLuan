import {
  BellOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Avatar, notification } from "antd";
import axios from "axios";
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as IconDoubleCheck } from '../../assets/icon/doubleCheck.svg';
import logo from "../../assets/images/logo1.png";
import { getUserProfile, logout } from "../../components/State/Authentication/Action";
import { useCartContext } from "../../components/cart/CartContext";
import socket from "../../components/config/socket";
import styles from "./Header.module.scss";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const jwt = localStorage.getItem("jwt");

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

  useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get("http://localhost:8080/v1/order-notify/list", {
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
          const response = await axios.get("http://localhost:8080/v1/review/list", {
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

      const reviewMenu = (
        <Menu>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Menu.Item key={review._id}>
                {review.message || "Review mới"}
              </Menu.Item>
            ))
          ) : (
            <Menu.Item>Không có review</Menu.Item>
          )}
        </Menu>
      );

       const [ isNotiOpen, setIsNotiOpen ] = useState(false);
        const notiContentRef = useRef(null);
        const bellRef = useRef(null);
      
        const handleNotiClick = (e) => {
          e.stopPropagation();
          setIsNotiOpen(!isNotiOpen);
          if (!isNotiOpen) {
              //fetchNotifications();
              //dispatch(actions.resetNoti());
              // handleReadAll();
          }
      };
      
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
      
      const handleReadAll = async (e) => {
        e.stopPropagation();
        if (notifications.length === 0) return;
      
        try {
          // Giả sử bạn có API để đánh dấu tất cả thông báo là đã đọc
          await axios.post(
            "http://localhost:8080/v1/order-notify/read-all",
            {},
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
          );
          setNotificationCount(0);
          notification.success({
            message: "Đã đánh dấu tất cả thông báo là đã đọc",
          });
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
          notification.error({
            message: "Lỗi khi đánh dấu đã đọc",
          });
        }
      };
      
      const handleDeleteAll = async (e) => {
        e.stopPropagation();
        if (notifications.length === 0) return;
      
        try {
          // Giả sử bạn có API để xóa tất cả thông báo
          await axios.delete("http://localhost:8080/v1/order-notify/delete-all", {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          setNotifications([]);
          setNotificationCount(0);
          notification.success({
            message: "Đã xóa tất cả thông báo",
          });
        } catch (error) {
          console.error("Error deleting all notifications:", error);
          notification.error({
            message: "Lỗi khi xóa thông báo",
          });
        }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className={styles.icon} onClick={handleNotiClick} ref={bellRef}>
          <div className={styles.iconNoti}>
            <Avatar
              icon={<BellOutlined />}
              style={{ border: "none", backgroundColor: "transparent", fontSize: '24px', cursor: 'pointer' }}
              className={styles.avatar}
            />
            {notificationCount > 0 && (
              <span className={styles.notificationCount}>
                {notificationCount}
              </span>
            )}
          </div>
          <div className={styles.content}></div>
          <div
            data-noti-open={isNotiOpen}
            className={styles.dropdownNoti}
          >
            <div className={styles.menuNoti} ref={notiContentRef}>
              <div
                style={{
                  padding: 8,
                  fontSize: 16,
                  opacity: 0.8,
                  fontWeight: 600,
                }}
                className={styles.headerNoti}
              >
                <div>THÔNG BÁO</div>
                <div className={styles.headerNotiRight}>
                  <div
                    onClick={handleReadAll}
                    className={styles.readAll}
                    style={{
                      cursor:
                        notifications.length === 0 ? "not-allowed" : "pointer",
                      opacity: notifications.length === 0 ? 0.5 : 1,
                    }}
                  >
                    <IconDoubleCheck />
                  </div>
                  <div
                    onClick={handleDeleteAll}
                    className={styles.deleteAll}
                    style={{
                      cursor:
                        notifications.length === 0 ? "not-allowed" : "pointer",
                      opacity: notifications.length === 0 ? 0.5 : 1,
                    }}
                  >
                    <DeleteOutlined />
                  </div>
                </div>
              </div>
              <div className={styles.dataNotify}>
                {notifications.length > 0 ? (
                  notifications.map((item) => {
                    const isRead = item.isRead || false;
                    const title = item.title || "Thông báo";
                    const content = item.message || "Không có nội dung";
                    const createdAt = item.createdAt
                      ? new Date(item.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "Vừa xong";

                    return (
                      <div
                        className={classNames(styles.itemNoti, {
                          [styles.read]: isRead,
                        })}
                        key={item._id}
                        onClick={() => {
                          if (!isRead) {
                            axios
                              .post(
                                `http://localhost:8080/v1/order-notify/read/${item._id}`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${jwt}`,
                                  },
                                }
                              )
                              .then(() => {
                                setNotifications((prev) =>
                                  prev.map((notif) =>
                                    notif._id === item._id
                                      ? { ...notif, isRead: true }
                                      : notif
                                  )
                                );
                                setNotificationCount((prev) => prev - 1);
                              })
                              .catch((error) => {
                                console.error(
                                  "Error marking notification as read:",
                                  error
                                );
                              });
                          }
                        }}
                      >
                        <div className={styles.iconProfile}>
                          <BellOutlined
                            style={{ fontSize: 20, color: isRead ? "#888" : "#ff7d01" }}
                          />
                        </div>
                        <div className={styles.desc}>
                          <div className={styles.titleNoti}>{title}</div>
                          <div className={styles.contentNoti}>{content}</div>
                          <div className={styles.date}>{createdAt}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: 8,
                      textAlign: "center",
                      color: "#888",
                      fontSize: 15,
                    }}
                  >
                    Chưa có thông báo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <IconButton
          color="inherit"
          sx={{ fontSize: "30px" }}
          onClick={handleMenuClick} 
        >
          <AccountCircle sx={{ fontSize: "inherit" }} />
        </IconButton>
        </div>
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
