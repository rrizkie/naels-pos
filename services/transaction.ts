import { onErrorAPICall } from "@/utils/error";
import { apiCall, Methods, ServiceProps } from "./api";

export type TransactionType = {
  id?: number;
  branch_name: string;
  total_transaction: number;
  downpayment: number;
  total_discount: number;
  nail_artist: string;
  status?: string;
  promotion_name?: string;
  promotion_value?: number;
  isDeleted?: boolean;
  createdAt?: Date;
};

export type CreateTransactionProps = {
  payload: TransactionType;
} & ServiceProps;

export type CreateTransactionResponse = {
  message: string;
  data: TransactionType;
  token: string;
};

export const createTransaction = async ({
  token,
  payload,
  onSuccess,
  onFailed,
  setLoading,
}: CreateTransactionProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.POST, "transaction", {
      data: payload,
      token,
    });

    onSuccess(res.data as CreateTransactionResponse);
  } catch (error) {
    onErrorAPICall(error);
    onFailed && onFailed(error);
  } finally {
    setLoading && setLoading(false);
  }
};

type TransactionProps = {
  params?: {
    branch?: string;
    artist?: string;
    page?: number;
    size?: number;
  };
} & ServiceProps;

export type TransactionResponse = {
  data: TransactionType[];
  total: number;
};

export const getTransactions = async ({
  token,
  params,
  setLoading,
  onSuccess,
  onFailed,
}: TransactionProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "transaction", {
      params,
      token,
    });

    onSuccess(res.data as TransactionResponse);
  } catch (error) {
    onErrorAPICall(error);
    onFailed && onFailed(error);
  } finally {
    setLoading && setLoading(false);
  }
};

export const exportTransactions = async ({
  token,
  params,
  setLoading,
  onSuccess,
  onFailed,
}: TransactionProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "transaction/export", {
      params,
      token,
      responseType: "arraybuffer",
    });

    onSuccess(res.data);
  } catch (error) {
    onErrorAPICall(error);
    onFailed && onFailed(error);
  } finally {
    setLoading && setLoading(false);
  }
};

type TransactionSummaryProps = {
  params?: {
    branch?: string;
    artist?: string;
  };
} & ServiceProps;

export type TransactionSummaryType = {
  branch_name: string;
  total_transaction: number;
};

export type TransactionSummaryResponse = {
  data: TransactionSummaryType[];
  total_transaction: number;
};

export const getTransactionSummary = async ({
  token,
  params,
  setLoading,
  onSuccess,
  onFailed,
}: TransactionSummaryProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "transaction/summary", {
      params,
      token,
    });

    onSuccess(res.data as TransactionSummaryResponse);
  } catch (error) {
    onErrorAPICall(error);
    onFailed && onFailed(error);
  } finally {
    setLoading && setLoading(false);
  }
};
