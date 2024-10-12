import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";
import { useNavigate } from "react-router-dom";
import { changePassword, updateUserProfile } from "../State/User/Action";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const onFinish = async (values) => {
    console.log("values", values);
    console.log("user", userProfile?._id);
    await dispatch(
      changePassword(userProfile?._id, {
        userData: {
          id: userProfile?._id,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      })
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thông tin người dùng</h2>
      <Form
        form={form}
        name="userProfile"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          fullname: userProfile?.fullname || "",
          phonenumber: userProfile?.phonenumber || "",
          email: userProfile?.email || "",
        }}
        autoComplete="off"
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu hiện tại"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            // Thêm custom validation để kiểm tra nếu mật khẩu mới và xác nhận mật khẩu không trùng khớp
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Xác nhận mật khẩu"
            style={{ height: "50px" }}
          />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => navigate(-1)}
            type="primary"
            style={{ height: "35px", width: "100px", marginRight: "12px" }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100px", height: "35px" }}
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
