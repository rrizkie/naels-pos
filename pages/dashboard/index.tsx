import React, { useCallback, useEffect, useState } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { mainPageHandler } from "@/props/server";
import {
  TransactionResponse,
  TransactionSummaryResponse,
  TransactionSummaryType,
  TransactionType,
  getTransactionSummary,
  getTransactions,
} from "@/services/transaction";
import DashboardCard from "@/components/DashboardCard";
import { DATE_SHORT_FORMAT, getDate } from "@/utils/date";
import { numberFormat } from "@/utils/currency";
import { PageProps } from "../_app";
import { BRANCH, MENU, ROLE } from "@/constants";
import { DownOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import CustomTable, { FilterProps, FilterType } from "@/components/CustomTable";
import { FilterFieldType } from "@/components/FilterDialog";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import moment from "moment";

export async function getServerSideProps(context: any) {
  return mainPageHandler(context);
}

const Dashboard: React.FC<PageProps> = (props) => {
  const { access_token, branch, role } = props;
  const { replace } = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [transactionSummary, setTransactionSummary] =
    useState<TransactionSummaryResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse | null>(
    null
  );
  const [filter, setFilter] = useState<FilterFieldType>({
    branch: undefined,
    artist: undefined,
    date: undefined,
  });
  const [page, setPage] = useState<number>(1);

  const column: ColumnsType<TransactionType> = [
    {
      title: "Branch",
      key: "branch_name",
      dataIndex: "branch_name",
      render: (branch_name: BRANCH, transcation) => (
        <div>
          <Typography style={{ fontWeight: 700 }}>
            {branch_name.replace("_", " ")}
          </Typography>
          <Typography style={{ fontWeight: 600, color: "#667085" }}>
            {transcation.nail_artist}
          </Typography>
        </div>
      ),
    },
    {
      title: "Total Price",
      key: "total_price",
      dataIndex: "total_price",
      align: "center",
      render: (price: number) => `Rp.${numberFormat(price)}`,
    },
    {
      title: "Date",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      render: (date: string) => getDate(date, DATE_SHORT_FORMAT),
    },
    // {
    //   title: "Artist",
    //   key: "nail_artist",
    //   dataIndex: "nail_artist",
    // },
  ];

  const filterProps: FilterProps | undefined = {
    branch,
    role,
    items: [FilterType.BRANCH, FilterType.ARTIST, FilterType.DATE],
    onClear: () => {
      setFilter({
        branch: undefined,
        artist: undefined,
        date: undefined,
      });
      replace({
        pathname: MENU.DASHBOARD,
        query: {},
      });
    },
    onApply: (val) => {
      setPage(1);
      if (val.date) {
        val.start_date = moment(val.date[0]).format("YYYY-MM-DD");
        val.end_date = moment(val.date[1]).format("YYYY-MM-DD");

        delete val.date;
      }
      setFilter(val);
      replace({
        pathname: MENU.DASHBOARD,
        query: { ...val },
      });
    },
  };

  const fetchTransactions = useCallback(async () => {
    const params = {
      ...filter,
      ...(branch !== BRANCH.ALL_BRANCH && { branch }),
      page,
      size: 10,
    };

    await getTransactions({
      token: access_token,
      params,
      onSuccess: (data: TransactionResponse) => {
        setTransactions(data);
      },
      setLoading,
    });
  }, [access_token, branch, page, filter]);

  const fetchTransactionSummary = useCallback(async () => {
    const params = {
      ...(branch !== BRANCH.ALL_BRANCH && { branch }),
    };

    await getTransactionSummary({
      token: access_token,
      params,
      onSuccess: (data: TransactionSummaryResponse) => {
        setTransactionSummary(data);
      },
      setLoading,
    });
  }, [access_token, branch]);

  const handlePagination = (val: TablePaginationConfig) => {
    setPage(val.current as number);
  };

  const handleExport = () => {
    console.log("export");
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactionSummary();
  }, [fetchTransactionSummary]);

  return (
    <div className="flex flex-col gap-24">
      {branch === BRANCH.ALL_BRANCH && (
        <div className="flex gap-12 w-full">
          <DashboardCard
            label="All Branch"
            value={`Rp. ${numberFormat(
              transactionSummary?.total_transaction as number
            )}`}
          />
        </div>
      )}
      <div className="flex gap-12 w-full">
        {transactionSummary &&
          transactionSummary?.data.map(
            (transaction: TransactionSummaryType, index: number) => (
              <DashboardCard
                key={index}
                label={transaction.branch_name.replace("_", " ")}
                value={`Rp. ${numberFormat(
                  transaction.total_transaction as number
                )}`}
              />
            )
          )}
      </div>
      <CustomTable
        column={column}
        data={transactions?.data as TransactionType[]}
        pagination={{
          current: page,
          total: transactions?.total as number,
        }}
        onChangePagination={handlePagination}
        loading={loading}
        onExport={branch === BRANCH.ALL_BRANCH ? handleExport : undefined}
        filter={branch === BRANCH.ALL_BRANCH ? filterProps : undefined}
        token={access_token}
      />
    </div>
  );
};

export default Dashboard;
