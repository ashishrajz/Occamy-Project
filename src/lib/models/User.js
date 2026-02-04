// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["ADMIN", "DISTRIBUTOR", "FARMER"],
      required: true,
    },

    language: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
    },

    region: {
      state: String,
      district: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
