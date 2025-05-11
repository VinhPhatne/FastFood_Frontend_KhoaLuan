import {
  BellOutlined,
  CommentOutlined,
  DeleteOutlined,
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
import sound from "../../assets/sounds/sound.mp3";

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

  const onMessage = () => {
    const audio = new Audio(sound);
    audio.load();
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
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
      setNotifications([]);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8080/v1/review/list", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = Array.isArray(response.data.review) ? response.data.review : [];
      setReviews(data);
      setReviewCount(data.filter((r) => !r.isRead).length);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (jwt) {
      fetchNotifications();
      fetchReviews();
      dispatch(getUserProfile());
    }
  }, [dispatch, jwt]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server via WebSocket");
      onMessage();
    });

    socket.on("order_notification", (newNotification) => {
      onMessage();
      fetchNotifications();
      notification.success({
        message: "Thông báo mới",
        description: newNotification.message || "Bạn có thông báo mới!",
      });
    });

    socket.on("review_notification", (newReview) => {
      onMessage();
      fetchReviews();
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

  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const notiContentRef = useRef(null);
  const bellRef = useRef(null);
  const reviewContentRef = useRef(null);
  const reviewRef = useRef(null);

  const handleNotiClick = (e) => {
    e.stopPropagation();
    setIsNotiOpen(!isNotiOpen);
    if (!isNotiOpen) {
      // Có thể fetch lại dữ liệu nếu cần
    }
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
    setIsReviewOpen(!isReviewOpen);
    if (!isReviewOpen) {
      // Có thể fetch lại dữ liệu nếu cần
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

      if (
        reviewRef.current &&
        !reviewRef.current.contains(event.target) &&
        reviewContentRef.current &&
        !reviewContentRef.current.contains(event.target) &&
        isReviewOpen
      ) {
        setIsReviewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotiOpen, isReviewOpen]);

  const handleReadNotification = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/v1/order-notify/update-isRead/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      setNotificationCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      notification.error({
        message: "Lỗi khi đánh dấu thông báo đã đọc",
      });
    }
  };

  const handleReadAllNotifications = async (e) => {
    e.stopPropagation();
    if (notifications.length === 0) return;

    try {
      await axios.patch(
        "http://localhost:8080/v1/order-notify/update-all-isRead",
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

  const handleDeleteAllNotifications = async (e) => {
    e.stopPropagation();
    if (notifications.length === 0) return;

    try {
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

  const handleReadReview = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8080/v1/review/update-isRead/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setReviews((prev) =>
        prev.map((review) =>
          review._id === id ? { ...review, isRead: true } : review
        )
      );
      setReviewCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking review as read:", error);
      notification.error({
        message: "Lỗi khi đánh dấu đánh giá đã đọc",
      });
    }
  };

  const handleReadAllReviews = async (e) => {
    e.stopPropagation();
    if (reviews.length === 0) return;

    try {
      await axios.patch(
        "http://localhost:8080/v1/review/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      setReviews((prev) =>
        prev.map((review) => ({ ...review, isRead: true }))
      );
      setReviewCount(0);
      notification.success({
        message: "Đã đánh dấu tất cả đánh giá là đã đọc",
      });
    } catch (error) {
      console.error("Error marking all reviews as read:", error);
      notification.error({
        message: "Lỗi khi đánh dấu đã đọc",
      });
    }
  };

  const handleDeleteAllReviews = async (e) => {
    e.stopPropagation();
    if (reviews.length === 0) return;

    try {
      await axios.delete("http://localhost:8080/v1/review/delete-all", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setReviews([]);
      setReviewCount(0);
      notification.success({
        message: "Đã xóa tất cả đánh giá",
      });
    } catch (error) {
      console.error("Error deleting all reviews:", error);
      notification.error({
        message: "Lỗi khi xóa đánh giá",
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
              ref={notiContentRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.menuNoti} >
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
                      onClick={handleReadAllNotifications}
                      className={styles.readAll}
                      style={{
                        cursor: notifications.length === 0 ? "not-allowed" : "pointer",
                        opacity: notifications.length === 0 ? 0.5 : 1,
                      }}
                    >
                      <IconDoubleCheck />
                    </div>
                    <div
                      onClick={handleDeleteAllNotifications}
                      className={styles.deleteAll}
                      style={{
                        cursor: notifications.length === 0 ? "not-allowed" : "pointer",
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
                              handleReadNotification(item._id);
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

          <div className={styles.icon} onClick={handleReviewClick} ref={reviewRef}>
            <div className={styles.iconNoti}>
              <Avatar
                icon={<CommentOutlined />}
                style={{ border: "none", backgroundColor: "transparent", fontSize: '24px', cursor: 'pointer' }}
                className={styles.avatar}
              />
              {reviewCount > 0 && (
                <span className={styles.notificationCount}>
                  {reviewCount}
                </span>
              )}
            </div>
            <div className={styles.content}></div>
            <div
              data-noti-open={isReviewOpen}
              className={styles.dropdownNoti}
              ref={reviewContentRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.menuNoti} >
                <div
                  style={{
                    padding: 8,
                    fontSize: 16,
                    opacity: 0.8,
                    fontWeight: 600,
                  }}
                  className={styles.headerNoti}
                >
                  <div>ĐÁNH GIÁ</div>
                  <div className={styles.headerNotiRight}>
                    <div
                      onClick={handleReadAllReviews}
                      className={styles.readAll}
                      style={{
                        cursor: reviews.length === 0 ? "not-allowed" : "pointer",
                        opacity: reviews.length === 0 ? 0.5 : 1,
                      }}
                    >
                      <IconDoubleCheck />
                    </div>
                    <div
                      onClick={handleDeleteAllReviews}
                      className={styles.deleteAll}
                      style={{
                        cursor: reviews.length === 0 ? "not-allowed" : "pointer",
                        opacity: reviews.length === 0 ? 0.5 : 1,
                      }}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>
                </div>
                <div className={styles.dataNotify}>
                  {reviews.length > 0 ? (
                    reviews.map((item) => {
                      const isRead = item.isRead || false;
                      const title = item.fullName || "Đánh giá";
                      const content = item.comment || "Không có nội dung";
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
                              handleReadReview(item._id);
                            }
                          }}
                        >
                          <div className={styles.iconProfile}>
                            <CommentOutlined
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
                      Chưa có đánh giá
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
