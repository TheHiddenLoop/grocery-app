import { axiosInstance } from "../../libs/axios";


export const check= async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data; 
  } catch (err) {
    console.log(err);
  }
}

export const signupApi = async (formData) => {
    try {
        const res = await axiosInstance.post("/auth/signup", formData);
        return res.data;
    } catch (err) {
        const message =
            err.response?.data?.message || err.message || "Signup failed";
        throw new Error(message);
    }
};

export const loginApi = async (formData) => {
    try {
        const res = await axiosInstance.post("/auth/login", formData);
        return res.data;
    } catch (err) {
        const message =
            err.response?.data?.message || err.message || "Signup failed";
        throw new Error(message);
    }
};

export const logout = async () => {
  try {
    const res = await axiosInstance.post("/auth/logout");    
    return res.data; 
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Logout failed";
    throw new Error(message);
  }
};


export const updateProfile = async (formData) => {
  try {
    const res = await axiosInstance.put("/auth/update", formData, {
      headers: { "Content-Type": "multipart/form-data" }, 
    });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Profile update failed";
    throw new Error(message);
  }
};