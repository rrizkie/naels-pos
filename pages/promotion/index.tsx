import CustomTable from "@/components/CustomTable";
import { mainPageHandler } from "@/props/server";
import {
  CreatePromotionPayload,
  PromotionResponse,
  PromotionType,
  createPromotion,
  getPromotions,
  updateStatusPromotion,
} from "@/services/promotion";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import React, { FC, useCallback, useEffect, useState } from "react";
import { PageProps } from "../_app";
import { Switch, Typography, notification } from "antd";
import { ROLE } from "@/constants";
import { PlusOutlined } from "@ant-design/icons";
import DialogForm, { DynamicFormType } from "@/components/DialogForm";
import { BranchType, getBranches } from "@/services/branch";

export async function getServerSideProps(context: any) {
  return mainPageHandler(context);
}

const Promotion: FC<PageProps> = (props) => {
  const { access_token, role } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const [branchOptions, setBranchOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [promotions, setPromotions] = useState<PromotionResponse | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const handlePagination = (val: TablePaginationConfig) => {
    setPage(val.current as number);
  };

  const handleSwitchStatus = async (val: boolean, promotion: PromotionType) => {
    await updateStatusPromotion({
      token: access_token,
      id: promotion.id as string,
      payload: {
        isActive: val,
      },
      onSuccess: () => {
        notification.success({
          message: "Successfully Updating Promotion status",
        });
        fetchPromotions();
      },
      setLoading,
    });
  };

  const handleCreatePromotion = async (val: CreatePromotionPayload) => {
    await createPromotion({
      payload: val,
      token: access_token,
      onSuccess: () => {
        notification.success({ message: "Successfully create new Promotion" });
        fetchPromotions();
      },
    });
  };

  const fetchPromotions = useCallback(async () => {
    await getPromotions({
      params: {
        page: 1,
        size: 10,
      },
      token: access_token,
      onSuccess: (data) => {
        setPromotions(data);
      },
      setLoading,
    });
  }, [access_token, page]);

  const createPromotionFormContent: DynamicFormType[] = [
    {
      type: "select",
      label: "Branch",
      name: "branch",
      options: branchOptions,
      disabled: loading,
      allowClear: true,
    },
    {
      type: "text-input",
      label: "Promotion Name",
      name: "name",
      disabled: loading,
      allowClear: true,
    },
    {
      type: "number-input",
      suffix: "%",
      label: "Discount Value",
      name: "value",
      disabled: loading,
      allowClear: true,
    },
  ];

  const column: ColumnsType<PromotionType> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Value",
      key: "value",
      dataIndex: "value",
      render: (value: number) => `${value}%`,
    },
  ];

  if (role !== ROLE.NAIL_ARTIST) {
    column.push({
      title: "Branch",
      key: "branch",
      dataIndex: "branch",
    });
    column.push({
      title: "Status",
      key: "isActive",
      dataIndex: "isActive",
      align: "center",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(val) => handleSwitchStatus(val, record)}
        />
      ),
    });
  }

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    getBranches({
      token: access_token,
      onSuccess: (data: BranchType[]) => {
        const options = data.map((el: BranchType) => ({
          value: el.name,
          label: el.name,
        }));
        setBranchOptions(options);
      },
    });
  }, [access_token]);

  return (
    <div>
      <div className="flex flex-row justify-end">
        <div
          className="flex flex-row items-center gap-8 cursor-pointer rounded-md"
          style={{
            background: "#232d3f",
            padding: "8px 16px",
            color: "white",
            width: "fit-content",
          }}
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusOutlined />
          <Typography
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "white",
            }}
          >
            Create promotion
          </Typography>
        </div>
      </div>
      <CustomTable
        column={column}
        data={promotions?.data as PromotionType[]}
        pagination={{
          current: page,
          total: promotions?.total as number,
        }}
        loading={loading}
        onChangePagination={handlePagination}
        token={access_token}
      />
      <DialogForm
        title="Create Promotion"
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePromotion}
        loading={loading}
        formContent={createPromotionFormContent}
      />
    </div>
  );
};

export default Promotion;
