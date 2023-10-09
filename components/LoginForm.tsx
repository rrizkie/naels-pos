import React, { FC } from "react";
import { Button, Form, Input } from "antd";
import Image from "next/image";
import { LOGO } from "@/constants";

type FieldType = {
  username: string;
  password: string;
};

interface LoginProps {
  onFinish: (val: FieldType) => void;
  loading: boolean;
}

const LoginForm: FC<LoginProps> = ({ onFinish, loading }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src={LOGO} width={250} height={200} alt="naels-mates" />
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input disabled={loading} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password disabled={loading} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full"
          disabled={loading}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
