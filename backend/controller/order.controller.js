import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Online stripe
export const placeOrderOnline = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body.product;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }


    const productIds = items.map(i => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Invalid products" });
    }

    let amount = 0;

    const line_items = items.map(item => {
      const product = products.find(
        p => p._id.toString() === item.product
      );

      if (!product || !product.inStock) {
        throw new Error("Product unavailable");
      }

      amount += product.offerPrice * item.quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: product.offerPrice * 100,
        },
        quantity: item.quantity,
      };
    });

    const tax = Math.floor((amount * 2) / 100);
    amount += tax;

    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "ONLINE",
      isPaid: false,
      status: "PENDING",
    });

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Tax (2%)" },
        unit_amount: tax * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.FRONTEND_URL}/my-orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(201).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body.product;

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    let amount = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor((amount * 2) / 100);

    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });

    await User.findByIdAndUpdate(userId, { cartItems: [] });

    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      $or: [
        { paymentType: "COD" },
        { paymentType: "ONLINE", isPaid: true },
      ],
    })
      .populate({ path: "items.product"})
      .populate("address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const terminalStatuses = ["DELIVERED", "CANCELLED"];
    if (terminalStatuses.includes(order.status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a ${order.status} order`,
      });
    }

    order.status = status.toUpperCase();
    await order.save();

    // Re-populate for consistent response shape
    const updatedOrder = await Order.findById(orderId)
      .populate({ path: "items.product" })
      .populate("address")
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status.toUpperCase()}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// PUT /api/order/:orderId/cancel
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status.toUpperCase() !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Only PENDING orders can be cancelled. Current status: ${order.status}`,
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "CANCELLED";
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate({ path: "items.product" })
      .populate("address")
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    const lowStockProducts = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
    });

    const validOrderFilter = {
      $or: [
        { paymentType: "COD" },
        { paymentType: "ONLINE", isPaid: true },
      ],
    };

    const totalOrders = await Order.countDocuments(validOrderFilter);

    const pendingOrders = await Order.countDocuments({
      ...validOrderFilter,
      status: "PENDING",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          ...validOrderFilter,
          status: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentOrders = await Order.find(validOrderFilter)
      .populate({ path: "items.product", select: "name image offerPrice price unit" })
      .populate("address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProductsList = await Product.find({
      stock: { $gt: 0, $lte: 10 },
    }).select("name image stock unit category");

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        outOfStockProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      },
      recentOrders,
      lowStockProductsList,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};