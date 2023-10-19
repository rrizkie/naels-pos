import React, { FC, useEffect } from "react";
import { Form, Input, Modal, Typography, Button, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export type CustomItemType = {
  name: string;
  desc?: string;
  price: number;
  qty: number;
};

interface CustomItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onAdd: (val: CustomItemType) => void;
}

const CustomItemDialog: FC<CustomItemDialogProps> = ({
  isOpen,
  onClose,
  loading,
  onAdd,
}) => {
  const { query } = useRouter();
  const [form] = Form.useForm();

  const handleApply = (val: CustomItemType) => {
    onAdd(val);
    onClose();
    form.resetFields();
  };

  const handleClear = () => {
    onClose();
    form.resetFields();
  };

  useEffect(() => {
    if (query) {
      form.setFieldsValue(query);
    }
  }, [query]);

  return (
    <Modal open={isOpen} title={null} footer={null} closable={false} centered>
      <div className="flex justify-between items-center mb-24">
        <Typography style={{ fontSize: 20, fontWeight: 700 }}>
          Filter
        </Typography>
        <CloseOutlined
          onClick={onClose}
          style={{ fontSize: 20, cursor: "pointer" }}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleApply}
        autoComplete="off"
      >
        <Form.Item<CustomItemType> label="Item Name" name="name">
          <Input disabled={loading} allowClear />
        </Form.Item>
        <Form.Item<CustomItemType>
          label="Item Description (optional)"
          name="desc"
        >
          <Input.TextArea disabled={loading} allowClear />
        </Form.Item>
        <Form.Item<CustomItemType> label="Item Price" name="price">
          <InputNumber
            disabled={loading}
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
        <Form.Item<CustomItemType> label="Item Qty" name="qty">
          <InputNumber disabled={loading} className="w-half" type="number" />
        </Form.Item>

        <div className="flex justify-between items-center gap-12 mt-24">
          <Button
            className="w-full"
            type="default"
            danger
            style={{ fontWeight: 700 }}
            disabled={loading}
            onClick={handleClear}
          >
            Cancel
          </Button>
          <Button
            htmlType="submit"
            style={{ background: "#232d3f", color: "white", fontWeight: 700 }}
            className="w-full"
            disabled={loading}
          >
            Add
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CustomItemDialog;
