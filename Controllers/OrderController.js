import Cart from "../Models/Cart.js";
import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import crypto from "crypto";

import { razorpayInstance } from "../Utils/razorpay.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let totalAmount = 0;

    cart.items.forEach(item => {
      totalAmount += item.product.currentPrice * item.quantity;
    });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", "YourTestSecretKey")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature)
      return res.status(400).json({ message: "Payment verification failed" });

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    let orderItems = [];
    let totalAmount = 0;

    cart.items.forEach(item => {
      totalAmount += item.product.currentPrice * item.quantity;

      orderItems.push({
        product: item.product._id,
        vendor: item.product.vendor,
        quantity: item.quantity,
        price: item.product.currentPrice,
      });
    });

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.find({ user: userId })
    .populate("items.product");

  res.json(orders);
};


// VENDOR ORDERS//


export const getVendorOrders = async (req, res) => {
  const vendorId = req.user.id;

  const orders = await Order.find({
    "items.vendor": vendorId
  })
  .populate("items.product")
  .populate("user", "mobile");

  res.json(orders);
};


// ADMIN ALL ORDERS


export const getAllOrdersAdmin = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "mobile")
    .populate("items.product");

  res.json(orders);
};


export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  order.orderStatus = status;

  await order.save();

  res.json({ message: "Order status updated", order });
};

export const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {

  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

export const razorpayWebhook = async (req, res) => {

  const webhookSignature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (webhookSignature === expectedSignature) {
    console.log("Webhook verified");
  } else {
    return res.status(400).json({ message: "Invalid webhook" });
  }

  res.status(200).json({ status: "ok" });
};
