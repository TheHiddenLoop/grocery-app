import { axiosInstance } from "../../libs/axios";

export const getOrdersApi = async () => {
  try {
    const res = await axiosInstance.get("/order/user");
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to get orders";
    throw new Error(message);
  }
};

export const cancelOrderApi = async (orderId) => {
  try {
    const res = await axiosInstance.patch(`/order/user/${orderId}/cancel`);
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to cancel order";
    throw new Error(message);
  }
};