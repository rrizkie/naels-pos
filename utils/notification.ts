import { notification } from "antd";
import { getErrorMessage } from "./error";

export type NotificationProps = {
  type?: "success" | "error" | "info";
  message?: any;
  description?: any;
  placement?: "topRight";
  className?: string;
};

export type ErrorNotificationProps = {
  error?: any;
} & NotificationProps;

export const showNotification = ({
  type = "info",
  message,
  description,
  placement,
  className,
}: NotificationProps) => {
  notification[type]({
    message,
    description,
    placement,
  });
};

export const showErrorNotification = ({
  message = "Error",
  description,
  error,
  ...rest
}: ErrorNotificationProps) => {
  showNotification({
    ...rest,
    message,
    description: getErrorMessage(error) || description,
    type: "error",
  });
};

export const showSuccessNotification = (props: NotificationProps) => {
  showNotification({ ...props, type: "success" });
};
