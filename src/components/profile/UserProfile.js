import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../State/Authentication/Action";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../State/User/Action";

const UserProfile = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const onFinish = async (values) => {
    await dispatch(
      updateUserProfile(userProfile?._id, {
        userData: { fullname: values.fullname, password: values.password },
      })
    );
  };

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        fullname: userProfile?.fullname || "",
        phonenumber: userProfile?.phonenumber || "",
        email: userProfile?.email || "",
      });
    }
  }, [userProfile, form]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-5">
      <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
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
          name="fullname"
          label="Họ và Tên"
          rules={[{ required: true, message: "Vui lòng nhập Họ và Tên!" }]}
        >
          <Input placeholder="Nhập Họ và Tên" className="h-12" />
        </Form.Item>

        <Form.Item
          name="phonenumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập Số điện thoại!" }]}
        >
          <Input placeholder="Nhập Số điện thoại" className="h-12" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" className="h-12" />
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

export default UserProfile;
