import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  cancelOrder,
  getAllOrders,
  getDashboardStats,
  getUserOrders,
  placeOrderCOD,
  placeOrderOnline,
  updateOrderStatus,
} from "../controller/order.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.get("/user", authUser, getUserOrders);
router.get("/seller", authSeller, getAllOrders);
router.post("/online", authUser, placeOrderOnline);
router.put("/:orderId/cancel", authSeller, cancelOrder);
router.put("/:orderId/status", authSeller, updateOrderStatus);
router.get("/stats", authSeller, getDashboardStats)


export default router;
