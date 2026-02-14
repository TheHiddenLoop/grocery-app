import User from "../models/user.model.js";

// update user cartData: /api/cart/update

export const updateCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { cartItems } = req.body;

    if (!cartItems || typeof cartItems !== "object") {
      return res.status(400).json({ message: "Invalid cart data" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mergedCart = {
      ...(user.cartItems || {}),
      ...cartItems,
    };

    user.cartItems = mergedCart;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
