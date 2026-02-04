"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ACTIVITY_TYPES = {
  MEETING_ONE_ON_ONE: "One-on-One Meeting",
  MEETING_GROUP: "Group Meeting",
  SAMPLE_DISTRIBUTION: "Sample Distribution",
  SALE: "Sale",
};

export default function LogActivityPage() {
  const router = useRouter();

  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [odometer, setOdometer] = useState("");
  const [photos, setPhotos] = useState([]);

  // Meeting
  const [meeting, setMeeting] = useState({
    personName: "",
    category: "FARMER",
    contact: "",
    village: "",
    attendeeCount: "",
    meetingType: "",
    businessPotential: "",
  });

  // Sample
  const [sample, setSample] = useState({
    productName: "",
    quantity: "",
    purpose: "TRIAL",
    givenTo: "",
  });

  // Sale
  const [sale, setSale] = useState({
    mode: "B2C",
    productName: "",
    sku: "",
    packSize: "",
    quantity: "",
    viaDistributor: "",
    isRepeatOrder: false,
  });

  async function handleSubmit() {
    if (!type) {
      alert("Select activity type");
      return;
    }

    navigator.geolocation.getCurrentPosition(async pos => {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("lat", pos.coords.latitude);
      formData.append("lng", pos.coords.longitude);
      formData.append("notes", notes);
      formData.append("odometer", odometer);

      if (type.startsWith("MEETING")) {
        formData.append("meeting", JSON.stringify(meeting));
      }

      if (type === "SAMPLE_DISTRIBUTION") {
        formData.append("sample", JSON.stringify(sample));
      }

      if (type === "SALE") {
        formData.append("sale", JSON.stringify(sale));
      }

      for (const photo of photos) {
        formData.append("photos", photo);
      }

      await fetch("/api/distributor/activity", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      alert("Activity logged successfully");
      router.push("/distributor");
    });
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Log Activity</h1>

      {/* Activity Type */}
      <select
        className="w-full border p-2"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="">Select Activity Type</option>
        {Object.entries(ACTIVITY_TYPES).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      {/* ================= MEETING ================= */}
      {type.startsWith("MEETING") && (
        <div className="space-y-2">
          <input
            placeholder="Person Name"
            className="w-full border p-2"
            value={meeting.personName}
            onChange={e =>
              setMeeting({ ...meeting, personName: e.target.value })
            }
          />

          <select
            className="w-full border p-2"
            value={meeting.category}
            onChange={e =>
              setMeeting({ ...meeting, category: e.target.value })
            }
          >
            <option value="FARMER">Farmer</option>
            <option value="SELLER">Seller</option>
            <option value="INFLUENCER">Influencer</option>
          </select>

          <input
            placeholder="Contact (optional)"
            className="w-full border p-2"
            value={meeting.contact}
            onChange={e =>
              setMeeting({ ...meeting, contact: e.target.value })
            }
          />

          {type === "MEETING_GROUP" && (
            <>
              <input
                placeholder="Village"
                className="w-full border p-2"
                value={meeting.village}
                onChange={e =>
                  setMeeting({ ...meeting, village: e.target.value })
                }
              />
              <input
                placeholder="Number of Attendees"
                type="number"
                className="w-full border p-2"
                value={meeting.attendeeCount}
                onChange={e =>
                  setMeeting({
                    ...meeting,
                    attendeeCount: e.target.value,
                  })
                }
              />
            </>
          )}

          <input
            placeholder="Business Potential (e.g. 5–10 kg)"
            className="w-full border p-2"
            value={meeting.businessPotential}
            onChange={e =>
              setMeeting({
                ...meeting,
                businessPotential: e.target.value,
              })
            }
          />
        </div>
      )}

      {/* ================= SAMPLE ================= */}
      {type === "SAMPLE_DISTRIBUTION" && (
        <div className="space-y-2">
          <input
            placeholder="Product Name"
            className="w-full border p-2"
            value={sample.productName}
            onChange={e =>
              setSample({ ...sample, productName: e.target.value })
            }
          />

          <input
            placeholder="Quantity"
            type="number"
            className="w-full border p-2"
            value={sample.quantity}
            onChange={e =>
              setSample({ ...sample, quantity: e.target.value })
            }
          />

          <select
            className="w-full border p-2"
            value={sample.purpose}
            onChange={e =>
              setSample({ ...sample, purpose: e.target.value })
            }
          >
            <option value="TRIAL">Trial</option>
            <option value="DEMO">Demo</option>
            <option value="FOLLOW_UP">Follow-up</option>
          </select>

          <input
            placeholder="Given To"
            className="w-full border p-2"
            value={sample.givenTo}
            onChange={e =>
              setSample({ ...sample, givenTo: e.target.value })
            }
          />
        </div>
      )}

      {/* ================= SALE ================= */}
      {type === "SALE" && (
        <div className="space-y-2">
          <select
            className="w-full border p-2"
            value={sale.mode}
            onChange={e => setSale({ ...sale, mode: e.target.value })}
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
          </select>

          <input
            placeholder="Product Name"
            className="w-full border p-2"
            value={sale.productName}
            onChange={e =>
              setSale({ ...sale, productName: e.target.value })
            }
          />

          <input
            placeholder="SKU"
            className="w-full border p-2"
            value={sale.sku}
            onChange={e => setSale({ ...sale, sku: e.target.value })}
          />

          <input
            placeholder="Pack Size"
            className="w-full border p-2"
            value={sale.packSize}
            onChange={e =>
              setSale({ ...sale, packSize: e.target.value })
            }
          />

          <input
            placeholder="Quantity"
            type="number"
            className="w-full border p-2"
            value={sale.quantity}
            onChange={e =>
              setSale({ ...sale, quantity: e.target.value })
            }
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sale.isRepeatOrder}
              onChange={e =>
                setSale({ ...sale, isRepeatOrder: e.target.checked })
              }
            />
            Repeat Order
          </label>
        </div>
      )}

      {/* ================= COMMON ================= */}
      <textarea
        placeholder="Additional Notes"
        className="w-full border p-2"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <input
        type="number"
        placeholder="Odometer Reading"
        className="w-full border p-2"
        value={odometer}
        onChange={e => setOdometer(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={e => setPhotos([...e.target.files])}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Submit Activity
      </button>
    </div>
  );
}
