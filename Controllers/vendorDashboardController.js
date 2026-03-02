import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import Inventory from "../Models/Inventory.js";
import User from "../Models/User.js";

export const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // ✅ Total products of this vendor
    const products = await Product.find({ vendor: vendorId });
    const totalProducts = products.length;

    // ✅ Categories of products (unique)
    const categories = [...new Set(products.map(p => p.category))];

    // ✅ Total inventory stock
    const inventories = await Inventory.find({ vendor: vendorId });
    const totalStock = inventories.reduce((acc, item) => acc + item.availableStock, 0);

    // ✅ Orders of vendor products
    const orders = await Order.find({ "items.vendor": vendorId });
    const totalOrders = orders.length;

    const completedOrders = orders.filter(o => o.status === "completed").length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const cancelledOrders = orders.filter(o => o.status === "cancelled").length;

    // ✅ Total revenue from completed orders
    const totalRevenue = orders
      .filter(o => o.status === "completed")
      .reduce((acc, o) => {
        // Sum only vendor's items
        const vendorAmount = o.items
          .filter(i => i.vendor.toString() === vendorId)
          .reduce((a, i) => a + i.price * i.quantity, 0);
        return acc + vendorAmount;
      }, 0);

    // ✅ Users who ordered from this vendor
    const userIds = [
      ...new Set(
        orders.flatMap(o =>
          o.items.some(i => i.vendor.toString() === vendorId) ? [o.user.toString()] : []
        )
      ),
    ];

    const users = await User.find({ _id: { $in: userIds } }).select("fullName mobile email");

    res.json({
      totalProducts,
      categories,
      totalStock,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      users,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
