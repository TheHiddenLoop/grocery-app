import {axiosInstance} from "../../lib/axios"

export const loginApi = async (credentials) => {
  try {
    const res = await axiosInstance.post(
      "/seller/login",
      credentials,
    );
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Login failed";
    throw new Error(message);
  }
};


export const meApi = async () => {
  try {
    const res = await axiosInstance.get(
      "/seller/is-auth",
    );
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || "Unauthorized";
    throw new Error(message);
  }
};
