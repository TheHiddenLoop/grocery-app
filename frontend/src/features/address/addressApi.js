import { axiosInstance } from "../../libs/axios.js";

// Get all addresses
export const getAddressesApi = async () => {
  try {
    const res = await axiosInstance.get("/address/get");
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch addresses"
    );
  }
};

// Add address
export const addAddressApi = async (addressData) => {
  try {
    const res = await axiosInstance.post(
      "/address/add",
      addressData
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to add address"
    );
  }
};

export const deleteAddressApi = async (id) => {
  try {
    const res = await axiosInstance.delete(
      `/address/${id}`
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete address"
    );
  }
};