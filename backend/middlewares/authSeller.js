import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authSeller = async (req, res, next) => {
  try {
    const token = req.cookies.sellerToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "seller" && decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const seller = await User.findById(decoded.id).select("-password");
    if (!seller) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (seller.role !== "seller" && seller.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.seller = seller; 
    next();
  } catch (error) {
    console.error("authSeller error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
