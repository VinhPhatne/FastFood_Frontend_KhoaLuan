import React from "react";
import { Modal, Input, Form, Button as AntButton, Flex } from "antd";
import styles from "./LoginForm.module.scss";
import { TbBrandGoogle } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { loginUser } from "../State/Authentication/Action";

const LoginForm = ({
  isModalVisible,
  handleCancel,
  handleLoginSuccess,
  switchToRegister,
}) => {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    await dispatch(
      loginUser({
        userData: { phoneNumber: values.email, password: values.password },
      })
    );
    handleCancel();
    handleLoginSuccess();
  };
  return (
    <Modal
      title={<div className={styles["modal-title"]}>Đăng nhập</div>}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="Số điện thoại / Email"
          rules={[
            { required: true, message: "Vui lòng nhập Số điện thoại / Email!" },
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
        <a href="#" className={styles.link}>
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
  );
};

export default LoginForm;
