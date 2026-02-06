import { axiosInstance } from "../../lib/axios";

export const addProductApi = async (formData) => {
  try {
    const res = await axiosInstance.post("/product/add-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to add product";
    throw new Error(message);
  }
};

export const getProductApi = async () => {
  try {
    const res = await axiosInstance.get("/product/list");
    
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to add product";
    throw new Error(message);
  }
};