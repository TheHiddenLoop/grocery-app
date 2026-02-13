import { axiosInstance } from "../../libs/axios";

export const viewProductApi = async (id) => {
  try {
    const res = await axiosInstance.get("product/"+id);
    return res.data.product; 
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Failed to fetch product";
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


