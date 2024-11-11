import React, { useState } from "react";
import {
  Modal,
  Input,
  Form,
  Button as AntButton,
  Flex,
  notification,
} from "antd";
import styles from "./LoginForm.module.scss";
import { TbBrandGoogle } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { loginUser } from "../State/Authentication/Action";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";
import { LOGIN_SUCCESS } from "../State/Authentication/ActionType";

const LoginForm = ({
  isModalVisible,
  handleCancel,
  handleLoginSuccess,
  switchToRegister,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [resetInfo, setResetInfo] = useState({});
  const [form] = Form.useForm();

  const closeModal = () => {
    form.resetFields();
    handleCancel();
  };

  const onFinish = async (values) => {
    try {
      const resultAction = await dispatch(
        loginUser({
          userData: { phoneNumber: values.email, password: values.password },
          navigate,
        })
      );
      if (resultAction.type === LOGIN_SUCCESS) {
        closeModal();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Đăng nhập thất bại";
      console.error(error);
      notification.error({ message });
    }
  };

  const openForgotPasswordModal = () => {
    closeModal();
    setIsForgotModalVisible(true);
  };

  const handleForgotPassword = async (values) => {
    try {
      await axios.post(`${API_URL}/v1/account/reset-password`, {
        email: values.email,
        phonenumber: values.phonenumber,
      });
      setResetInfo(values);
      setIsForgotModalVisible(false);
      setIsOtpModalVisible(true);
    } catch (error) {
      const message = error.response?.data?.message || "Có lỗi xảy ra";
      notification.error({ message });
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      const { email, phonenumber } = resetInfo;
      const { otp, newPassword } = values;
      await axios.post(`${API_URL}/v1/account/verify-change-password`, {
        otp: Number(otp),
        newPassword,
        email,
        phonenumber,
      });
      notification.success({
        message: "Thành công",
        description: "Mật khẩu của bạn đã được thay đổi!",
      });
      setIsOtpModalVisible(false);
    } catch (error) {
      const message = error.response?.data?.message || "Xác thực OTP thất bại!";
      notification.error({ message });
    }
  };

  return (
    <>
      <Modal
        title={<div className={styles["modal-title"]}>Đăng nhập</div>}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            email: "",
            password: "",
          }}
        >
          <Form.Item
            name="email"
            label="Số điện thoại / Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Số điện thoại / Email!",
              },
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!",
              },
            ]}
            className={styles["form-item"]}
          >
            <Input
              placeholder="Nhập Số điện thoại / Email"
              style={{ height: "50px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className={styles["form-item"]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              style={{ height: "50px" }}
            />
          </Form.Item>

          <Form.Item>
            <AntButton
              type="primary"
              htmlType="submit"
              className={styles["submit-button"]}
            >
              Đăng nhập
            </AntButton>
          </Form.Item>
        </Form>

        <div className={styles["link-container"]}>
          <a href="#" className={styles.link} onClick={openForgotPasswordModal}>
            Quên mật khẩu
          </a>
          <a href="#" className={styles.link} onClick={switchToRegister}>
            Đăng ký
          </a>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            display: "flex",
            justifyItems: "center",
            flexDirection: "column",
            alignItems: "center",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          Hoặc đăng nhập với
          <AntButton className={styles["google-button"]}>
            <TbBrandGoogle />
            Google
          </AntButton>
        </div>
      </Modal>

      {/* Modal Quên mật khẩu */}
      <Modal
        title={<div className={styles["modal-title"]}>Quên mật khẩu</div>}
        visible={isForgotModalVisible}
        onCancel={() => setIsForgotModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleForgotPassword} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email không đúng định dạng!",
              },
            ]}
            className={styles["form-item"]}
          >
            <Input placeholder="Nhập email" style={{ height: "50px" }} />
          </Form.Item>

          <Form.Item
            name="phonenumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!",
              },
            ]}
            className={styles["form-item"]}
          >
            <Input
              placeholder="Nhập số điện thoại"
              style={{ height: "50px" }}
            />
          </Form.Item>

          <Form.Item>
            <AntButton
              type="primary"
              htmlType="submit"
              className={styles["submit-button"]}
            >
              Xác nhận
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xác nhận OTP */}
      <Modal
        title={<div className={styles["modal-title"]}>Xác nhận OTP</div>}
        visible={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleVerifyOtp} layout="vertical">
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
            className={styles["form-item"]}
          >
            <Input placeholder="Nhập mã OTP" style={{ height: "50px" }} />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
            className={styles["form-item"]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              style={{ height: "50px" }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
            className={styles["form-item"]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu"
              style={{ height: "50px" }}
            />
          </Form.Item>

          <Form.Item>
            <AntButton
              type="primary"
              htmlType="submit"
              className={styles["submit-button"]}
            >
              Xác nhận
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LoginForm;
