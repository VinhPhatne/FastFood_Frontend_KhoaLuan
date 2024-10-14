import React from "react";
import { Modal, Input, Form, Button as AntButton, Row, Col } from "antd";
import styles from "./RegisterForm.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../State/Authentication/Action";

const RegisterForm = ({ isModalVisible, handleCancel, switchToLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const reqData = {
      fullname: values.fullName,
      phonenumber: values.phoneNumber,
      password: values.password,
      navigate,
    };
    dispatch(registerUser(reqData));
    handleCancel();
  };
  return (
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
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              className={styles["form-item"]}
            >
              <Input placeholder="Nhập họ và tên" style={{ height: "50px" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Địa chỉ email"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email!" },
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
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
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
  );
};

export default RegisterForm;
