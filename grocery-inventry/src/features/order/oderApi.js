import { axiosInstance } from "../../lib/axios";

export const allOrdersApi = async () => {
  try {
    const res = await axiosInstance.get("/order/seller");
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to get all product";
    throw new Error(message);
  }
};
