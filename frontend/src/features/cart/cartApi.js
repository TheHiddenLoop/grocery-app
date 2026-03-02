import { axiosInstance } from "../../libs/axios";

export const getCartApi = async () => {
  try {
    const res = await axiosInstance.get("/cart");
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to fetch cart"
    );
  }
};

export const addToCartApi = async (productId) => {
  try {
    const res = await axiosInstance.post("/cart/add", { productId });
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to add to cart"
    );
  }
};

export const updateCartApi = async (productId, quantity) => {
  try {
    const res = await axiosInstance.patch("/cart/update", {
      productId,
      quantity,
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to update cart"
    );
  }
};

export const removeFromCartApi = async (productId) => {
  try {
    const res = await axiosInstance.delete(`/cart/${productId}`);
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to remove item"
    );
  }
};

export const clearCartApi = async () => {
  try {
    const res = await axiosInstance.delete("/cart/clear");
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to clear cart"
    );
  }
};