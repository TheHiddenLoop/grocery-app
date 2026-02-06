import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// seller login : /api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await User.findOne({ email, role: "admin" });
    if (!seller) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign(
      { id: seller._id, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
      },
    });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check seller auth  : /api/seller/is-auth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      seller: req.seller,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// logout seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
