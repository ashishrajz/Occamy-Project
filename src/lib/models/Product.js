// src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    animalType: {
      type: String,
      enum: ["COW", "BUFFALO", "GOAT", "BULL"],
    },

    milkYieldRange: String, // "Up to 8L", "8–20L"

    category: {
      type: String, // Immunity, Protein, Weight Gain
    },

    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
