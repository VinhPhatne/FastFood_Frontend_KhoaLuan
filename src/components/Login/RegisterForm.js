import React from "react";
import { Modal, Input, Form, Button as AntButton, Row, Col } from "antd";
import styles from "./RegisterForm.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../State/Authentication/Action";

const RegisterForm = ({ isModalVisible, handleCancel }) => {
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
  };
  return (
    <Modal
      title="Đăng ký"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      className={styles["register-form"]}
    >
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Địa chỉ email"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email!" },
              ]}
            >
              <Input placeholder="mail@example.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="confirmPassword"
              label="Nhập lại mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="referralCode" label="Mã giới thiệu">
              <Input placeholder="Mã giới thiệu" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <AntButton
            type="primary"
            htmlType="submit"
            block
            style={{ backgroundColor: "#00acc1", color: "#fff", width: "30%" }}
          >
            Đăng ký
          </AntButton>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterForm;
