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
import { loginUser, get2FAQrCode, verify2FA } from "../State/Authentication/Action";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import axios from 'axios';
import { API_URL } from "../config/api";

const LoginForm = ({
  isLoginVisible,
  isForgotPasswordVisible,
  isOtpVisible,
  handleCancel,
  switchToRegister,
  switchToForgotPassword,
  switchToOtp,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetInfo, setResetInfo] = useState({});
  const [form] = Form.useForm();
  const [forgotForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [is2FAVisible, setIs2FAVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loadingVerify2FA, setLoadingVerify2FA] = useState(false);

  const onFinish = async (values) => {
    try {
      const resultAction = await dispatch(
        loginUser({
          userData: { phoneNumber: values.email, password: values.password },
          navigate,
          setIs2FAVisible,
          setQrCodeUrl,
          setUserId,
        })
      );
      if (resultAction.type === "LOGIN_SUCCESS") {
        if (!resultAction.payload.showQrCode) {
          handleCancel();
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Đăng nhập thất bại";
      console.error(error);
      notification.error({ message });
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      await axios.post(`${API_URL}/v1/account/reset-password`, {
        email: values.email,
        phonenumber: values.phonenumber,
      });
      setResetInfo(values);
      switchToOtp();
      forgotForm.resetFields();
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
      handleCancel();
      otpForm.resetFields();
    } catch (error) {
      const message = error.response?.data?.message || "Xác thực OTP thất bại!";
      notification.error({ message });
    }
  };

  const handleVerify2FA = async () => {
    try {
      setLoadingVerify2FA(true);
      const values = await otpForm.validateFields();
      await dispatch(
        verify2FA({
          userId,
          otp: values.otp,
          navigate,
        })
      );
      setIs2FAVisible(false);
      setQrCodeUrl(null);
      otpForm.resetFields();
      handleCancel();
    } catch (error) {
      const message = error.response?.data?.message || "Xác thực 2FA thất bại!";
      notification.error({ message });
    } finally {
      setLoadingVerify2FA(false);
    }
  };

  return (
    <>
      <Modal
        title={<div className={styles["modal-title"]}>Đăng nhập</div>}
        visible={isLoginVisible}
        onCancel={handleCancel}
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
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Số điện thoại",
              },
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!",
              },
            ]}
            className={styles["form-item"]}
          >
            <Input
              placeholder="Nhập Số điện thoại"
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
          <a href="#" className={styles.link} onClick={switchToForgotPassword}>
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

      <Modal
        title={<div className={styles["modal-title"]}>Quên mật khẩu</div>}
        visible={isForgotPasswordVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={forgotForm}
          onFinish={handleForgotPassword}
          layout="vertical"
        >
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

      <Modal
        title={<div className={styles["modal-title"]}>Xác nhận OTP</div>}
        visible={isOtpVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={otpForm} onFinish={handleVerifyOtp} layout="vertical">
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

      <Modal
        title={<div className={styles["modal-title"]}>Xác thực hai yếu tố</div>}
        visible={is2FAVisible}
        width={550}
        onCancel={() => {
          setIs2FAVisible(false);
          setQrCodeUrl(null);
          otpForm.resetFields();
          handleCancel();
        }}
        footer={null}
      >
        <div style={{ width: "max-content", minWidth: 500 }}>
          <h2>XÁC THỰC</h2>
          {qrCodeUrl && (
            <Flex align="center" vertical gap={24} style={{ marginBottom: 24 }}>
              <div>
                <h4 style={{ margin: "0 0 8px 0" }}>Quét Mã vạch QR</h4>
                <span style={{ opacity: "0.6", fontSize: 14 }}>
                  Thiết lập tài khoản mới trong ứng dụng xác thực của bạn và quét mã vạch QR sau
                </span>
              </div>
              <img src={qrCodeUrl} style={{ width: 240, height: 240 }} />
            </Flex>
          )}
          <Form form={otpForm} name="otp-form" layout="vertical">
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="Nhập mã OTP"
                size="large"
                type="number"
              />
            </Form.Item>
            <Flex justify="end" gap={8}>
              <AntButton
                type="primary"
                size="large"
                loading={loadingVerify2FA}
                style={{ width: "max-content" }}
                onClick={handleVerify2FA}
              >
                Xác nhận
              </AntButton>
              <AntButton
                size="large"
                onClick={() => {
                  setIs2FAVisible(false);
                  setQrCodeUrl(null);
                  otpForm.resetFields();
                  handleCancel();
                }}
                style={{ width: "max-content" }}
              >
                Hủy
              </AntButton>
            </Flex>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default LoginForm;