import React, { useCallback, useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mainPageHandler } from "@/props/server";
import { TransactionType, getTransactions } from "@/services/transaction";
import DashboardCard from "@/components/DashboardCard";
import { DATE_SHORT_FORMAT, getDate } from "@/utils/date";
import { numberFormat } from "@/utils/currency";
import { PageProps } from "../_app";

export async function getServerSideProps(context: any) {
  return mainPageHandler(context);
}

const Dashboard: React.FC<PageProps> = (props) => {
  const { access_token } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  const column: ColumnsType<TransactionType> = [
    {
      title: "Branch",
      key: "branch_name",
      dataIndex: "branch_name",
    },
    {
      title: "Total Price",
      key: "total_price",
      dataIndex: "total_price",
      render: (price: number) => `Rp.${numberFormat(price)}`,
    },
    {
      title: "Date",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date: string) => getDate(date, DATE_SHORT_FORMAT),
    },
    {
      title: "Artist",
      key: "nail_artist",
      dataIndex: "nail_artist",
    },
  ];

  const fetchTransactions = useCallback(async () => {
    await getTransactions({
      token: access_token,
      onSuccess: (data: TransactionType[]) => {
        setTransactions(data);
      },
      setLoading,
    });
  }, [access_token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="flex flex-col gap-24">
      <div className="flex gap-12 w-full">
        <DashboardCard label="TEBET" value={`Rp. ${numberFormat(80000)}`} />
      </div>
      <Table
        rowKey={(record) => record.id as number}
        dataSource={transactions}
        columns={column}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
