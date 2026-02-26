import { axiosInstance } from "../../lib/axios";

export const getDashboardStatsApi = async () => {
  try {
    const res = await axiosInstance.get("/order/stats");
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to fetch dashboard stats";
    throw new Error(message);
  }
};