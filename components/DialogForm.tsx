import { CloseOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Modal,
  Select,
  Typography,
  DatePicker,
  Button,
  InputNumber,
} from "antd";
import React, { FC } from "react";

const { RangePicker } = DatePicker;

interface DialogFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (val: any) => void;
  loading: boolean;
  formContent: DynamicFormType[];
  cancelText?: string;
  confirmText?: string;
}

export type DynamicFormType = {
  type:
    | "text-input"
    | "number-input"
    | "input-currency"
    | "select"
    | "date-range";
  label: string;
  name: string;
  allowClear?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string }[];
  suffix?: string;
  prefix?: string;
};

const RenderForm = ({
  label,
  name,
  type,
  allowClear,
  disabled,
  options,
  suffix,
  prefix,
}: DynamicFormType) => {
  if (type === "select") {
    return (
      <Form.Item label={label} name={name}>
        <Select disabled={disabled} options={options} allowClear={allowClear} />
      </Form.Item>
    );
  }

  if (type === "text-input") {
    return (
      <Form.Item label={label} name={name}>
        <Input disabled={disabled} allowClear={allowClear} />
      </Form.Item>
    );
  }

  if (type === "number-input") {
    return (
      <Form.Item label={label} name={name}>
        <InputNumber
          disabled={disabled}
          className="w-full"
          type="number"
          suffix={suffix}
          prefix={prefix}
        />
      </Form.Item>
    );
  }

  if (type === "input-currency") {
    return (
      <Form.Item label={label} name={name}>
        <InputNumber
          disabled={disabled}
          className="w-full"
          type="number"
          formatter={(val) =>
            `${val}`
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              .replace(/\.(?=\d{0,2}$)/g, ",")
          }
          parser={(val) =>
            Number.parseFloat(
              val!.replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")
            ).toFixed(2)
          }
          prefix="Rp"
        />
      </Form.Item>
    );
  }

  if (type === "date-range") {
    return (
      <Form.Item label={label} name={name}>
        <RangePicker
          disabled={disabled}
          className="w-full"
          format={"DD-MM-YYYY"}
        />
      </Form.Item>
    );
  }
};

const DialogForm: FC<DialogFormProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  loading,
  formContent,
  cancelText = "Cancel",
  confirmText = "Confirm",
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  const handleSubmit = (val: any) => {
    onSubmit(val);
    onClose();
    form.resetFields();
  };

  return (
    <Modal open={isOpen} title={null} footer={null} closable={false} centered>
      <div className="flex justify-between items-center mb-24">
        <Typography style={{ fontSize: 20, fontWeight: 700 }}>
          {title}
        </Typography>
        <CloseOutlined
          onClick={handleCancel}
          style={{ fontSize: 20, cursor: "pointer" }}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {formContent.map((el, index) => (
          <RenderForm key={index} {...el} />
        ))}
        <div className="flex justify-between items-center gap-12 mt-24">
          <Button
            className="w-full"
            type="default"
            danger
            style={{ fontWeight: 700 }}
            disabled={loading}
            onClick={handleCancel}
          >
            {cancelText}
          </Button>
          <Button
            htmlType="submit"
            style={{ background: "#232d3f", color: "white", fontWeight: 700 }}
            className="w-full"
            disabled={loading}
          >
            {confirmText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DialogForm;
