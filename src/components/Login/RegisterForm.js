import React, { useState } from "react";
import {
  Modal,
  Input,
  Form,
  Button as AntButton,
  Row,
  Col,
  notification,
  InputNumber,
} from "antd";
import styles from "./RegisterForm.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../State/Authentication/Action";
import axios from "axios";
import { API_URL, api } from "../config/api";

const RegisterForm = ({ isModalVisible, handleCancel, switchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpData, setOtpData] = useState({});
  const [form] = Form.useForm();

  // const onFinish = (values) => {
  //   const reqData = {
  //     fullname: values.fullName,
  //     phonenumber: values.phoneNumber,
  //     password: values.password,
  //     navigate,
  //   };
  //   dispatch(registerUser(reqData));
  //   handleCancel();
  // };

  const sendOtp = async (values) => {
    try {
      const { confirmPassword, ...filteredValues } = values;
      const { data } = await axios.post(
        `${API_URL}/v1/account/send-otp`,
        filteredValues
      );
      setOtpData(filteredValues);
      setOtpModalVisible(true);
      handleCancel();
      notification.success({ message: "OTP đã được gửi thành công!" });
    } catch (error) {
      const message = error.response?.data?.message || "Gửi OTP thất bại!";
      console.error(error);
      notification.error({ message });
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const payload = { ...otpData, otp: parseInt(otp, 10) };
      const { data } = await axios.post(
        `${API_URL}/v1/account/verify-otp`,
        payload
      );
      notification.success({ message: "Xác thực OTP thành công!" });
      navigate("/");
      setOtpModalVisible(false);
      form.resetFields();
      handleCancel();
    } catch (error) {
      const message = error.response?.data?.message || "Xác thực OTP thất bại!";
      console.error(error);
      notification.error({ message });
    }
  };

  const onFinish = (values) => sendOtp(values);
  return (
    <>
      {/* Register Form Modal */}
      <Modal
        title={
          <div
            style={{
              fontSize: "32px",
              color: "#ff7d01",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Đăng ký
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className={styles["register-form"]}
        width={700}
      >
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fullname"
                label="Họ và tên"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
                className={styles["form-item"]}
              >
                <Input
                  placeholder="Nhập họ và tên"
                  style={{ height: "50px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Địa chỉ email"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ email!" },
                  {
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Email không đúng định dạng!",
                  },
                ]}
                className={styles["form-item"]}
              >
                <Input
                  placeholder="mail@example.com"
                  style={{ height: "50px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
                className={styles["form-item"]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  style={{ height: "50px" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phonenumber"
                label="Số điện thoại"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^0\d{9}$/,
                    message:
                      "Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!",
                  },
                ]}
                className={styles["form-item"]}
              >
                <Input
                  placeholder="Nhập số điện thoại"
                  style={{ height: "50px" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="referralCode"
                label="Mã giới thiệu"
                className={styles["form-item"]}
              >
                <Input placeholder="Mã giới thiệu" style={{ height: "50px" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  color: "#ff7d01",
                  fontWeight: "500",
                  marginLeft: "2px",
                }}
              >
                <a style={{ fontSize: "18px" }} onClick={switchToLogin}>
                  Đăng nhập
                </a>
              </div>
              <AntButton
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#ff7d01",
                  color: "#fff",
                  width: "25%",
                  fontSize: "17px",
                  height: "40px",
                  fontWeight: "500",
                }}
              >
                Đăng ký
              </AntButton>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {/* OTP Verification Modal */}
      <Modal
        title={<div className={styles["modal-title"]}>Xác nhận OTP</div>}
        visible={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          onFinish={(values) => verifyOtp(values.otp)}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="otp"
            label="OTP"
            rules={[{ required: true, message: "Vui lòng nhập OTP!" }]}
            className={styles["form-item"]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Nhập OTP" />
          </Form.Item>

          <Form.Item>
            <AntButton
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#ff7d01",
                color: "#fff",
                width: "100%",
                fontSize: "17px",
                height: "40px",
                fontWeight: "500",
              }}
            >
              Xác thực OTP
            </AntButton>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RegisterForm;
