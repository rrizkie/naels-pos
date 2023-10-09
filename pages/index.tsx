import React, { useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@/components/LoginForm";
import { LoginResponse, login } from "@/services/auth";
import { MENU, STORAGE_KEY } from "@/constants";
import { setLocalStorage } from "@/utils/storage";
import { loginPageHandler } from "@/props/server";

type FieldType = {
  username: string;
  password: string;
};

export async function getServerSideProps(context: any) {
  return loginPageHandler(context);
}

export default function Home() {
  const { push } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: FieldType) => {
    login({
      payload: values,
      onSuccess: (data: LoginResponse) => {
        setLocalStorage(
          STORAGE_KEY.USER_INFO,
          JSON.stringify({
            username: data.username,
            role: data.role,
            branch: data.branch,
          })
        );
        push({
          pathname: MENU.REDIRECT,
          query: {
            access_token: data.access_token,
            username: data.username,
            role: data.role,
            branch: data.branch,
          },
        });
      },
      setLoading,
    });
  };

  return <LoginForm onFinish={onFinish} loading={loading} />;
}
