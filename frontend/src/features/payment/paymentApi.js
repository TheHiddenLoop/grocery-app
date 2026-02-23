import {axiosInstance} from "../../libs/axios.js"

// COD Payment
export const codPaymentApi = async (product) => {
  try {
    const res = await axiosInstance.post("/payment/cod", { product });
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to buy with COD"
    );
  }
};

export const stripePaymentApi = async (product) => {
  try {
    const res = await axiosInstance.post("/payment/stripe", { product });
    return res.data; 
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Stripe payment failed"
    );
  }
};