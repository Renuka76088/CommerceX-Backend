import VendorRequest from "../Models/VendorRequest.js";
import User from "../models/User.js";

export const submitVendorRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const alreadyRequested = await VendorRequest.findOne({
      user: userId,
      status: "pending"
    });

    if (alreadyRequested) {
      return res.status(400).json({
        message: "You already have a pending request"
      });
    }

    const request = await VendorRequest.create({
      user: userId,
      ...req.body
    });

    res.status(201).json({
      message: "Vendor request submitted successfully",
      request
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllVendorRequests = async (req, res) => {
  try {
    const requests = await VendorRequest.find()
      .populate("user", "mobile email role")
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendorRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;

    const request = await VendorRequest.findById(requestId);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Already processed" });

    request.status = status;

    if (status === "rejected") {
      request.rejectionReason = rejectionReason;
    }

    await request.save();

    // ✅ If Approved → Update user role
    if (status === "approved") {
      await User.findByIdAndUpdate(request.user, {
        role: "vendor"
      });
    }

    res.json({
      message: `Request ${status} successfully`
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

