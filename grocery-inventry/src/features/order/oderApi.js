import { axiosInstance } from "../../lib/axios";

export const allOrdersApi = async () => {
  try {
    const res = await axiosInstance.get("/order/seller");
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to get all orders";
    throw new Error(message);
  }
};

export const updateOrderStatusApi = async ({ orderId, status }) => {
  try {
    const res = await axiosInstance.put(`/order/${orderId}/status`, { status });
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to update order status";
    throw new Error(message);
  }
};

export const cancelOrderApi = async (orderId) => {
  try {
    const res = await axiosInstance.put(`/order/${orderId}/cancel`);
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to cancel order";
    throw new Error(message);
  }
};