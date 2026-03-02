import express from "express";
import {
  submitVendorRequest,
  getAllVendorRequests,
  updateVendorRequestStatus
} from "../Controllers/vendorRequestController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// User can submit request
router.post("/submit", authMiddleware(["user"]), submitVendorRequest);

// Admin can see all requests
router.get("/all", authMiddleware(["admin"]),   );

// Admin approve / reject
router.put(
  "/update-status/:requestId",
  authMiddleware(["admin"]),
  updateVendorRequestStatus
);

export default router;
