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
    //console.log("Received values:", values);

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

  console.log("0000>>>>:", userProfile?._id);
  console.log("userProfile>>>>:", userProfile?.phonenumber);
  console.log("userProfile>>>>:", userProfile?.email);

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
          name="fullname"
          label="Họ và Tên"
          rules={[{ required: true, message: "Vui lòng nhập Họ và Tên!" }]}
        >
          <Input placeholder="Nhập Họ và Tên" style={{ height: "50px" }} />
        </Form.Item>

        <Form.Item
          name="phonenumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập Số điện thoại!" }]}
        >
          <Input placeholder="Nhập Số điện thoại" style={{ height: "50px" }} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
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

export default UserProfile;
