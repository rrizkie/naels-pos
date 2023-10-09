import { BASE_URL, MENU } from "@/constants";
import axios from "axios";

export type ServiceProps = {
  token?: string;
  setLoading?: (loading: boolean) => void;
  onSuccess: (val: any) => void;
  onFailed?: (err: any) => void;
};

export enum Methods {
  GET = "get",
  POST = "post",
  PUT = "put",
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    let errorCode = err?.response?.status;
    if (errorCode === 401) {
      if (typeof window !== "undefined") {
        window.location.href = MENU.LOGOUT;
      }
    }
    return Promise.reject(err);
  }
);

export const apiCall = (
  method: Methods,
  urlPath: string,
  headers?: {
    data?: any;
    params?: any;
    token?: string;
  }
) => {
  axios.defaults.headers.common = {
    ...(headers?.token && { Authorization: `Bearer ${headers?.token}` }),
  };

  return axios({
    method,
    url: BASE_URL + urlPath,
    ...headers,
  });
};
