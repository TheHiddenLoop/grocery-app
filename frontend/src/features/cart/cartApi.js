import { axiosInstance } from "../../libs/axios";


export const addCartApi = async (cartItems) => {
  try {
    const res = await axiosInstance.post("/cart/update", { cartItems });
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update cart"
    );
  }
};
