// ================== ENV ==================
import dotenv from "dotenv";
dotenv.config();

// ================== CORE ==================
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ================== ROUTES ==================
import AuthRoutes from "./Routes/AuthRoutes.js";
import ProductRoutes from "./Routes/productRoutes.js";
import ProductDetailsRoutes from "./Routes/productDetailsRoutes.js";
import ExtraGiftRoutes from "./Routes/extraGiftRoutes.js";
import CouponRoutes from "./Routes/couponRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js";
import OrdersRoutes from "./Routes/OrdersRoutes.js";
import InventoryRoutes from "./Routes/inventoryRoutes.js";
import VendorRequestRoutes from "./Routes/vendorRequestRoutes.js";
import ReviewRoutes from "./Routes/reviewRoutes.js";
import AnalyticsdRoutes from "./Routes/vendorDashboardRoutes.js";
import CategorydRoutes from "./Routes/categoryRoutes.js";
   



// ================== APP ==================
const app = express();

// ================== PATH ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ================== 🔥 GLOBAL CORS (NEVER FAIL) ==================
app.use(
  cors({
    origin: true, // ✅ allow ALL origins (browser, localhost, live, any port)
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// ✅ Preflight – VERY IMPORTANT
// app.options("*", cors());

// ================== MIDDLEWARE ==================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================== STATIC ==================
app.use("/certs", express.static(join(__dirname, "public/certs")));

// ================== ROUTES ==================
app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/products/details", ProductDetailsRoutes);
app.use("/api/products/gifts", ExtraGiftRoutes);
app.use("/api/products/coupons", CouponRoutes);
app.use("/api/products/cart", CartRoutes);
app.use("/api/products/orders", OrdersRoutes);
app.use("/api/products/inventory", InventoryRoutes);
app.use("/api/vendor-requests", VendorRequestRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/analytics", AnalyticsdRoutes);
app.use("/api/categories", CategorydRoutes);


// ================== DEFAULT ==================
app.get("/", (req, res) => {
  res.send("🚀 Skinnveda API running successfully");
});

// ================== DB + SERVER ==================
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGOURL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("✅ DB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
