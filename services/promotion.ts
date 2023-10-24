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

export type GetPromotionsProps = {
  params: {
    branch?: string;
    isActive?: boolean;
    page?: number;
    size?: number;
  };
} & ServiceProps;

export type PromotionResponse = {
  data: PromotionType[];
  total: number;
};

export const getPromotions = async ({
  params,
  token,
  onSuccess,
  setLoading,
}: GetPromotionsProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "promotion", {
      params,
      token,
    });

    onSuccess(res.data as PromotionResponse);
  } catch (error) {
    onErrorAPICall(error);
  } finally {
    setLoading && setLoading(false);
  }
};

export type UpdateStatusPromotionProps = {
  id: string;
  payload: {
    isActive: boolean;
  };
} & ServiceProps;

export const updateStatusPromotion = async ({
  id,
  payload,
  token,
  onSuccess,
  setLoading,
}: UpdateStatusPromotionProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.PUT, `promotion/${id}`, {
      data: payload,
      token,
    });

    onSuccess(res.data);
  } catch (error) {
    onErrorAPICall(error);
  } finally {
    setLoading && setLoading(false);
  }
};

export type CreatePromotionPayload = {
  branch: string;
  name: string;
  value: number;
};

export type CreatePromotionProps = {
  payload: CreatePromotionPayload;
} & ServiceProps;

export const createPromotion = async ({
  payload,
  token,
  onSuccess,
  setLoading,
}: CreatePromotionProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.POST, `promotion`, {
      data: payload,
      token,
    });

    onSuccess(res.data);
  } catch (error) {
    onErrorAPICall(error);
  } finally {
    setLoading && setLoading(false);
  }
};
