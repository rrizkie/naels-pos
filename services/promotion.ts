import { onErrorAPICall } from "@/utils/error";
import { apiCall, Methods, ServiceProps } from "./api";

export type PromotionType = {
  id: number | string;
  name: string;
  value: number;
  branch: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
};

export const getPromotions = async ({
  token,
  onSuccess,
  setLoading,
}: ServiceProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "promotion", {
      token,
    });

    onSuccess(res.data as PromotionType[]);
  } catch (error) {
    onErrorAPICall(error);
  } finally {
    setLoading && setLoading(false);
  }
};
