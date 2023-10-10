import React, { FC, useEffect, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Select,
  Typography,
  DatePicker,
  Button,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { BranchType, getBranches } from "@/services/branch";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import moment from "moment";

const { RangePicker } = DatePicker;

export type FilterFieldType = {
  branch?: string;
  artist?: string;
  date?: string | Date;
};

interface FiletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onApply: (val: FilterFieldType) => void;
  onClear: () => void;
  token: string;
}

const FilterDialog: FC<FiletDialogProps> = ({
  isOpen,
  onClose,
  loading,
  onApply,
  onClear,
  token,
}) => {
  const { query } = useRouter();
  const [form] = Form.useForm();
  const [branches, setBranches] = useState<BranchType[]>([]);

  useEffect(() => {
    getBranches({
      token,
      onSuccess: (data: BranchType[]) => {
        setBranches(data);
      },
    });
  }, [token]);

  const handleApply = (val: FilterFieldType) => {
    console.log(val);
    onApply(val);
    onClose();
    form.resetFields();
  };

  const handleClear = () => {
    onClear();
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
        <Form.Item<FilterFieldType> label="Branch name" name="branch">
          <Select
            disabled={loading}
            options={branches.map((branch: BranchType) => ({
              label: branch.name.replace("_", " "),
              value: branch.name,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item<FilterFieldType> label="Nail Artist" name="artist">
          <Input disabled={loading} allowClear />
        </Form.Item>
        <Form.Item<FilterFieldType> label="Transaction Date" name="date">
          <RangePicker
            disabled={loading}
            className="w-full"
            format={"DD-MM-YYYY"}
          />
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
            Clear
          </Button>
          <Button
            htmlType="submit"
            style={{ background: "#232d3f", color: "white", fontWeight: 700 }}
            className="w-full"
            disabled={loading}
          >
            Apply
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FilterDialog;
