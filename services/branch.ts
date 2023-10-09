import { onErrorAPICall } from "@/utils/error";
import { apiCall, Methods, ServiceProps } from "./api";
import { BRANCH } from "@/constants";

export type BranchType = {
  id: number | string;
  name: BRANCH;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date | string;
};

export const getBranches = async ({
  token,
  onSuccess,
  setLoading,
}: ServiceProps) => {
  setLoading && setLoading(true);
  try {
    const res = await apiCall(Methods.GET, "branch", {
      token,
    });

    onSuccess(res.data as BranchType[]);
  } catch (error) {
    onErrorAPICall(error);
  } finally {
    setLoading && setLoading(false);
  }
};
