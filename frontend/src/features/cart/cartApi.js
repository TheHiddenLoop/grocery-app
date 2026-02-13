export const addCartApi = async (cartItems) => {
  try {
    const res = await axiosInstance.post("/cart/update", { cartItems });
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to add cart";
    throw new Error(message);
  }
};