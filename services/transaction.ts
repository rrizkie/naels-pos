import { onErrorAPICall } from "@/utils/error";
import { apiCall, Methods, ServiceProps } from "./api";

type TransactionProps = {
  params?: any;
} & ServiceProps;

export type TransactionType = {
  id?: number;
  branch_name: string;
  total_price: number;
  nail_artist_id: number;
  nail_artist: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
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

    onSuccess(res.data as TransactionType[]);
  } catch (error) {
    onErrorAPICall(error);
    onFailed && onFailed(error);
  } finally {
    setLoading && setLoading(false);
  }
};
