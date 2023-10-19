import { onErrorAPICall } from "@/utils/error";
import { apiCall, Methods, ServiceProps } from "./api";

export type ItemType = {
  id: number;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
};

export const getitems = async ({
  token,
  onSuccess,
  setLoading,
}: ServiceProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "item", {
      token,
    });

    onSuccess(res.data as ItemType[]);
  } catch (error) {
    onErrorAPICall(error);
  } finally {
    setLoading && setLoading(false);
  }
};
