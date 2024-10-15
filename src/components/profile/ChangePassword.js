import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../State/User/Action";

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
    <div className="flex flex-col items-center justify-center p-5" style={{ height: "500px" }}>
      <h2 className="text-2xl font-semibold mb-6">Đổi Mật Khẩu</h2>
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
        className="w-full max-w-md" // Chiều rộng tối đa cho form
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
            className="h-12"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" className="h-12" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
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
          <Input.Password placeholder="Xác nhận mật khẩu" className="h-12" />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
            onClick={() => navigate(-1)}
            type="default"
            className="mr-2 w-28"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="w-28"
            style={{
              backgroundColor: "#ff7d01",
              color: "#fff",
              fontWeight: "500",
            }}
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
