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

    if (!address || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order details" });
    }

    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const item of items) {
      const product = productMap.get(item.product?.toString());

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock: ${product.name}`,
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product: ${product.name}`,
        });
      }
    }

    let subtotal = 0;

    const line_items = items.map((item) => {
      const product = productMap.get(item.product.toString());
      subtotal += product.offerPrice * item.quantity;

      return {
        price_data: {
          currency: "inr",
          product_data: { name: product.name },
          unit_amount: product.offerPrice * 100, // Stripe expects paise
        },
        quantity: item.quantity,
      };
    });

    const tax = Math.floor((subtotal * 2) / 100);
    const totalAmount = subtotal + tax;

    const itemsWithPrice = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: productMap.get(item.product.toString()).offerPrice, // price lock
    }));

    const order = await Order.create({
      userId,
      items: itemsWithPrice,
      address,
      amount: totalAmount,
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
      success_url: `${process.env.FRONTEND_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return res.status(201).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("placeOrderOnline error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
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

// GET /order/user — fetch all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      userId,
      $or: [
        { paymentType: "COD" },
        { paymentType: "ONLINE", isPaid: true },
      ],
    })
      .populate({
        path: "items.product",
        select: "name price offerPrice image unit category inStock",
      })
      .populate({
        path: "address",
        select: "street city state pincode",
      })
      .select("_id userId items amount status paymentType isPaid address createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("User Get Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// PATCH /order/user/:orderId/cancel — cancel an order
export const cancelOrderUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
  
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const cancellableStatuses = ["PENDING", "CONFIRMED", "PROCESSING"];
    if (!cancellableStatuses.includes(order.status?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.status = "CANCELLED";
    order.cancelledAt = new Date();
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

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

    if (
      order.paymentType === "COD" &&
      order.status === "DELIVERED" &&
      !order.isPaid
    ) {
      order.isPaid = true;
    }

    await order.save();

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