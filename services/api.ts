import { BASE_URL } from "@/constants";
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
