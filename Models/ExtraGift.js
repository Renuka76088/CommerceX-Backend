import mongoose from "mongoose";

const extraGiftSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    price: Number,
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("ExtraGift", extraGiftSchema);
