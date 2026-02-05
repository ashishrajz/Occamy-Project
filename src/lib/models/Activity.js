import mongoose from "mongoose";

/**
 * SINGLE SOURCE OF TRUTH FOR PRODUCTS
 * (Must match frontend dropdown)
 */
const PRODUCT_ENUM = [
  "RAKSHAK",
  "BOVI_BOOSTER",
  "JODI_NO_1",
  "BUCK_BOOSTER",
];

const ActivitySchema = new mongoose.Schema({
  // =====================
  // RELATIONS
  // =====================
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

  // =====================
  // ACTIVITY TYPE
  // =====================
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

  // =====================
  // GEO / FILTERABLE LOCATION META
  // =====================
  geo: {
    state: String,
    district: String,
    village: String,
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
    personName: {
      type: String,
      required: function () {
        return this.type.startsWith("MEETING");
      },
    },

    category: {
      type: String,
      enum: ["FARMER", "SELLER", "INFLUENCER"],
    },

    contact: String,

    meetingKind: {
      type: String,
      enum: ["ONE_ON_ONE", "GROUP"],
    },

    attendeeCount: {
      type: Number,
      required: function () {
        return (
          this.type === "MEETING_GROUP" ||
          this.meeting?.meetingKind === "GROUP"
        );
      },
    },

    businessPotential: String,

    intent: {
      type: String,
      enum: ["TRIAL", "DEMO", "FOLLOW_UP"],
      required: function () {
        return this.type.startsWith("MEETING");
      },
    },
  },

  // =====================
  // SAMPLE DATA
  // =====================
  sample: {
    productId: {
      type: String,
      enum: PRODUCT_ENUM,
      required: function () {
        return this.type === "SAMPLE_DISTRIBUTION";
      },
    },

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
    productId: {
      type: String,
      enum: PRODUCT_ENUM,
      required: function () {
        return this.type === "SALE";
      },
    },

    customerName: {
      type: String,
      required: function () {
        return this.type === "SALE";
      },
    },

    customerCategory: {
      type: String,
      enum: ["FARMER", "DISTRIBUTOR", "RETAILER"],
    },

    sku: String,
    packSize: String,

    quantity: Number,

    mode: {
      type: String,
      enum: ["B2C", "B2B"],
    },

    isFollowUpSale: Boolean,
    isRepeatOrder: Boolean,

    amount: Number,
  },

  // =====================
  // MEDIA & NOTES
  // =====================
  photos: [String],
  odometerReading: Number,
  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);
