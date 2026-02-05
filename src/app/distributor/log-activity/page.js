"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/constants/products";

export default function LogActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetType = searchParams.get("type");

  const [type, setType] = useState("");

  const [notes, setNotes] = useState("");
  const [odometer, setOdometer] = useState("");
  const [photos, setPhotos] = useState([]);

  // ================= MEETING =================
  const [meeting, setMeeting] = useState({
    personName: "",
    category: "FARMER",
    contact: "",
    meetingKind: "ONE_ON_ONE", // ONE_ON_ONE | GROUP
    attendeeCount: "",
    intent: "TRIAL",
    businessPotential: "",
  });

  // ================= SAMPLE =================
  const [sample, setSample] = useState({
    productId: "",
    quantity: "",
    purpose: "TRIAL",
    givenTo: "",
  });

  // ================= SALE =================
  const [sale, setSale] = useState({
    customerName: "",
    customerCategory: "FARMER",
    mode: "B2C",
    productId: "",
    quantity: "",
    isFollowUpSale: false,
    isRepeatOrder: false,
  });

  useEffect(() => {
    if (presetType) setType(presetType);
  }, [presetType]);

  async function handleSubmit() {
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

      router.push("/distributor");
    });
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">
        {type.replaceAll("_", " ")}
      </h1>

      {/* ================= MEETING ================= */}
      {type.startsWith("MEETING") && (
        <div className="space-y-2">
          <input
            placeholder="Person / Group Name"
            className="w-full border p-2"
            value={meeting.personName}
            onChange={e =>
              setMeeting({ ...meeting, personName: e.target.value })
            }
          />

          <input
            placeholder="Contact Number (optional)"
            className="w-full border p-2"
            value={meeting.contact}
            onChange={e =>
              setMeeting({ ...meeting, contact: e.target.value })
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

          <select
            className="w-full border p-2"
            value={meeting.meetingKind}
            onChange={e =>
              setMeeting({ ...meeting, meetingKind: e.target.value })
            }
          >
            <option value="ONE_ON_ONE">One-on-One</option>
            <option value="GROUP">Group</option>
          </select>

          {meeting.meetingKind === "GROUP" && (
            <input
              type="number"
              placeholder="Number of Attendees"
              className="w-full border p-2"
              value={meeting.attendeeCount}
              onChange={e =>
                setMeeting({
                  ...meeting,
                  attendeeCount: e.target.value,
                })
              }
            />
          )}

          <select
            className="w-full border p-2"
            value={meeting.intent}
            onChange={e =>
              setMeeting({ ...meeting, intent: e.target.value })
            }
          >
            <option value="TRIAL">Trial</option>
            <option value="DEMO">Demo</option>
            <option value="FOLLOW_UP">Follow-up</option>
          </select>

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
          <select
            className="w-full border p-2"
            value={sample.productId}
            onChange={e =>
              setSample({ ...sample, productId: e.target.value })
            }
          >
            <option value="">Select Product</option>
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
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
            placeholder="Given To (Farmer / Group)"
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
          <input
            placeholder="Customer Name"
            className="w-full border p-2"
            value={sale.customerName}
            onChange={e =>
              setSale({ ...sale, customerName: e.target.value })
            }
          />

          <select
            className="w-full border p-2"
            value={sale.customerCategory}
            onChange={e =>
              setSale({
                ...sale,
                customerCategory: e.target.value,
              })
            }
          >
            <option value="FARMER">Farmer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="RETAILER">Retailer</option>
          </select>

          <select
            className="w-full border p-2"
            value={sale.mode}
            onChange={e => setSale({ ...sale, mode: e.target.value })}
          >
            <option value="B2C">B2C</option>
            <option value="B2B">B2B</option>
          </select>

          <select
            className="w-full border p-2"
            value={sale.productId}
            onChange={e =>
              setSale({ ...sale, productId: e.target.value })
            }
          >
            <option value="">Select Product</option>
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="w-full border p-2"
            value={sale.quantity}
            onChange={e =>
              setSale({ ...sale, quantity: e.target.value })
            }
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sale.isFollowUpSale}
              onChange={e =>
                setSale({
                  ...sale,
                  isFollowUpSale: e.target.checked,
                })
              }
            />
            Follow-up Sale
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sale.isRepeatOrder}
              onChange={e =>
                setSale({
                  ...sale,
                  isRepeatOrder: e.target.checked,
                })
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
