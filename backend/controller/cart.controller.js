import mongoose from "mongoose";
import User from "../models/user.model.js";

const cleanCartItems = (cartItems) =>
  cartItems.filter((item) => item.productId);

export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId).populate("cartItems.productId");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartItems = cleanCartItems(user.cartItems);

    res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const itemIndex = user.cartItems.findIndex(
      (item) => item.productId?.toString() === productId
    );

    if (itemIndex > -1) {
      user.cartItems[itemIndex].quantity += 1;
    } else {
      user.cartItems.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity: 1,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.error("AddToCart Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    if (quantity === 0) {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { cartItems: { productId: new mongoose.Types.ObjectId(productId) } } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cartItems: user.cartItems,
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be 0 (remove) or greater",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const item = user.cartItems.find(
      (item) => item.productId?.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params; 

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cartItems: { productId: new mongoose.Types.ObjectId(productId) } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems: [] },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};