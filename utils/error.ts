import { Router } from "next/router";
import { showErrorNotification } from "./notification";

export const getErrorResponse = (err: any) => {
  let message = "",
    code = 0;
  if (err) {
    if (err.response && typeof err.response === "object") {
      if (err.response.hasOwnProperty("data")) {
        message = err.response.data.errors[0].detail;
        code = err.response.data.errors[0].code;
      }
    }
  }
  return {
    message,
    code,
  };
};

export const getErrorCode = (err: any) => {
  const { code } = getErrorResponse(err);
  return code ? code : "";
};

export const getErrorMessage = (err: any, withCode?: boolean) => {
  if (err) {
    return err?.response?.data?.message;
  }
};

export const onErrorAPICall = (error: any) => {
  showErrorNotification({ error }); // else handle by Axios interceptor
};
