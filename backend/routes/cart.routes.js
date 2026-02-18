import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cart.controller.js";

import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.get("/", authUser, getCart);
router.post("/add", authUser, addToCart);
router.post("/update", authUser, updateCartItem);
router.post("/remove", authUser, removeFromCart);
router.post("/clear", authUser, clearCart);

export default router;
