// src/models/DistributorDay.js
import mongoose from "mongoose";

const DistributorDaySchema = new mongoose.Schema(
  {
    distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    startTime: Date,
    startLocation: {
      lat: Number,
      lng: Number,
    },
    startAddress: String,

    endTime: Date,
    endLocation: {
      lat: Number,
      lng: Number,
    },
    endAddress: String,

    totalDistanceKm: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.DistributorDay ||
  mongoose.model("DistributorDay", DistributorDaySchema);
