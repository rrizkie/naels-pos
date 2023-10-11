import React, { useCallback, useEffect, useState } from "react";
import { Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { mainPageHandler } from "@/props/server";
import {
  TransactionResponse,
  TransactionSummaryResponse,
  TransactionSummaryType,
  TransactionType,
  exportTransactions,
  getTransactionSummary,
  getTransactions,
} from "@/services/transaction";
import DashboardCard from "@/components/DashboardCard";
import {
  getDate,
  DEFAULT_DATE_FORMAT_DASH,
  DATETIME_SHORT_FORMAT,
} from "@/utils/date";
import { numberFormat } from "@/utils/currency";
import { PageProps } from "../_app";
import { BRANCH, MENU } from "@/constants";
import CustomTable, { FilterProps, FilterType } from "@/components/CustomTable";
import { FilterFieldType } from "@/components/FilterDialog";
import { useRouter } from "next/router";
import moment from "moment";
import exportFile from "@/utils/exportFilte";

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
      render: (date: string) => getDate(date, DATETIME_SHORT_FORMAT),
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
      for (const key in val) {
        if (!val[key]) delete val[key];
      }

      if (val.date) {
        val.start_date = moment(new Date(val.date[0])).format(
          DEFAULT_DATE_FORMAT_DASH
        );
        val.end_date = moment(new Date(val.date[1])).format(
          DEFAULT_DATE_FORMAT_DASH
        );

        delete val.date;
      }

      setFilter(val);
      setPage(1);
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

  const handleExport = async () => {
    const params = {
      ...filter,
      ...(branch !== BRANCH.ALL_BRANCH && { branch }),
    };
    await exportTransactions({
      token: access_token,
      params,
      onSuccess: (data) => {
        exportFile(
          data,
          `Transactions${moment(new Date()).format(
            DEFAULT_DATE_FORMAT_DASH
          )}.xlsx`
        );
      },
      setLoading,
    });
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
