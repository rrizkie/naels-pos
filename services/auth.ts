import { onErrorAPICall } from "@/utils/error";
import { apiCall, Methods, ServiceProps } from "./api";
import { BRANCH, ROLE } from "@/constants";

type LoginProps = {
  payload: { username: string; password: string };
} & ServiceProps;

export type LoginResponse = {
  id: number | string;
  branch: BRANCH;
  username: string;
  role: ROLE;
  access_token: string;
};

export const login = async ({
  payload,
  setLoading,
  onSuccess,
  onFailed,
}: LoginProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.POST, "user/login", {
      data: payload,
    });

    onSuccess(res.data.data as LoginResponse);
  } catch (error) {
    onErrorAPICall(error);
    onFailed && onFailed(error);
  } finally {
    setLoading && setLoading(false);
  }
};
