import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  type: { type: String }, // Instagram, Facebook etc
  url: { type: String }
});

const vendorRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fullName: { type: String, required: true },
  email: { type: String, required: true },
  businessName: { type: String, required: true },
  city: { type: String, required: true },
  interestedCategory: { type: String, required: true },

  mobileNumber: { type: String, required: true },
  alternateContact: { type: String },
  whatsappNumber: { type: String },

  address: { type: String, required: true },
  gstNumber: { type: String },

  foundUsFrom: { type: String },

  socialLinks: [socialLinkSchema],

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  rejectionReason: { type: String }

}, { timestamps: true });

export default mongoose.model("VendorRequest", vendorRequestSchema);
