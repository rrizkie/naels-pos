import React, { FC, useState } from "react";
import { Table, Typography, DatePicker } from "antd";
import { DownOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { BRANCH, ROLE } from "@/constants";
import FilterDialog from "./FilterDialog";

export enum FilterType {
  BRANCH = "BRANCH",
  ARTIST = "ARTIST",
  DATE = "DATE",
}

export type FilterProps = {
  branch: BRANCH;
  role: ROLE;
  items: FilterType[];
  onClear: () => void;
  onApply: (values: any) => void;
};

interface CustomTableProps {
  column: ColumnsType<any>;
  data: any[];
  pagination?: {
    total: number;
    current: number;
  };
  onChangePagination: (val: TablePaginationConfig) => void;
  loading: boolean;
  filter?: FilterProps;
  onExport?: () => void;
  token: string;
}

const CustomTable: FC<CustomTableProps> = ({
  column,
  data,
  pagination,
  onChangePagination,
  loading = false,
  filter,
  onExport,
  token,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <div className="mt-24">
      <div className="flex flex-row justify-between gap-24 mb-12">
        {filter && (
          <div
            className="flex flex-row items-center gap-8 cursor-pointer rounded-md"
            style={{
              background: "#232d3f",
              padding: "8px 16px",
              color: "white",
            }}
            onClick={() => setIsFilterOpen(true)}
          >
            <Typography
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "white",
              }}
            >
              Filter
            </Typography>
            <DownOutlined style={{ fontSize: 16 }} />
          </div>
        )}
        {onExport && (
          <div
            className="flex flex-row items-center gap-8 cursor-pointer rounded-md"
            style={{
              background: "#232d3f",
              padding: "8px 16px",
              color: "white",
            }}
            onClick={onExport}
          >
            <Typography
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "white",
              }}
            >
              Export
            </Typography>
            <VerticalAlignBottomOutlined style={{ fontSize: 20 }} />
          </div>
        )}
      </div>
      <Table
        rowKey={(record) => record.id as number}
        dataSource={data}
        columns={column}
        pagination={
          pagination
            ? {
                current: pagination.current,
                total: pagination.total,
              }
            : false
        }
        onChange={onChangePagination}
        loading={loading}
        scroll={{
          x: 480,
        }}
      />
      {filter && (
        <FilterDialog
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          loading={loading}
          onApply={filter?.onApply}
          onClear={filter?.onClear}
          token={token}
        />
      )}
    </div>
  );
};

export default CustomTable;
