import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  day: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DistributorDay",
    required: true,
  },

  type: {
    type: String,
    enum: [
      "MEETING_ONE_ON_ONE",
      "MEETING_GROUP",
      "SAMPLE_DISTRIBUTION",
      "SALE",
      "LOCATION_PING",
    ],
    required: true,
  },

  location: {
    lat: Number,
    lng: Number,
  },
  address: String,


  // =====================
  // MEETING DATA
  // =====================
  meeting: {
    personName: String,
    category: {
      type: String,
      enum: ["FARMER", "SELLER", "INFLUENCER"],
    },
    contact: String,
    village: String,
    attendeeCount: Number,
    meetingType: String,
    businessPotential: String, // e.g. "5–10 kg", "200 kg"
  },

  // =====================
  // SAMPLE DATA
  // =====================
  sample: {
    productName: String,
    quantity: Number,
    purpose: {
      type: String,
      enum: ["TRIAL", "DEMO", "FOLLOW_UP"],
    },
    givenTo: String,
  },

  // =====================
  // SALE DATA
  // =====================
  sale: {
    mode: {
      type: String,
      enum: ["B2C", "B2B"],
    },
    productName: String,
    sku: String,
    packSize: String,
    quantity: Number,
    viaDistributor: String,
    isRepeatOrder: Boolean,
  },

  // =====================
  // MEDIA
  // =====================
  photos: [String], // Cloudinary URLs
  odometerReading: Number,
  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
