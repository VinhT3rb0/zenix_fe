"use client";

import { Form, Input, Button } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserLoginMutation } from "@/api/app_home/app_home";

function Login() {
  const router = useRouter();
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const onChangeInput = () => {
    setErrorLogin(null);
  };

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const result = await userLogin(values);
      if ("data" in result) {
        handleLoginSuccess(result.data);
      } else if ("error" in result) {
        setErrorLogin("Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorLogin("Lỗi hệ thống, vui lòng thử lại!");
    }
  };

  const handleLoginSuccess = (data: any) => {
    setCookie("access_token", data.access_token, { maxAge: 7 * 24 * 60 * 60, path: "/" });
    setCookie("refresh_token", data.refresh_token, { maxAge: 7 * 24 * 60 * 60, path: "/" });
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push(`/project`);
  };

  return (
    <div className="bg-[#172b4d] relative h-screen flex flex-col justify-center items-center">
      <div className="bg-gradient-login trapezoid absolute top-0 right-0 left-0"></div>
      
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">Đăng nhập</h2>
        
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}>
            <Input
              prefix={<AiOutlineUser className="text-gray-500 mr-2" />}
              placeholder="Username"
              onChange={onChangeInput}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password
              prefix={<CiLock className="text-gray-500 mr-2" />}
              placeholder="Password"
              onChange={onChangeInput}
            />
          </Form.Item>

          {errorLogin && <div className="text-red-500 mb-3">{errorLogin}</div>}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default function Home() {
  return <Login />;
}
