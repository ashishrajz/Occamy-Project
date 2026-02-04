// src/models/Farmer.js
import mongoose from "mongoose";

const FarmerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,

    farmerType: {
      type: String,
      enum: ["BACKYARD", "BIG_FARM", "GAUSHALA"],
    },

    region: {
      state: String,
      district: String,
      village: String,
    },

    linkedDistributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Farmer ||
  mongoose.model("Farmer", FarmerSchema);
