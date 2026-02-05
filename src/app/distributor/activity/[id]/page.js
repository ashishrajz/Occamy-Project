"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MapView from "@/components/MapView";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/distributor/activity/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setActivity);
  }, [id]);

  if (!activity) {
    return (
      <div className="p-4 text-gray-500">
        Loading activity…
      </div>
    );
  }

  if (activity.error) {
    return (
      <div className="p-4 text-red-600">
        {activity.error}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">
        {formatType(activity.type)}
      </h1>

      {/* MAP */}
      <MapView activities={[activity]} />

      {/* BASIC INFO */}
      <Info label="Time">
        {new Date(activity.createdAt).toLocaleString()}
      </Info>

      {activity.address && (
        <Info label="Location">
          {activity.address}
        </Info>
      )}

      {/* MEETING DETAILS */}
      {activity.meeting && (
        <Section title="Meeting Details">
          <Info label="Person">
            {activity.meeting.personName}
          </Info>
          <Info label="Category">
            {activity.meeting.category}
          </Info>
          {activity.meeting.village && (
            <Info label="Village">
              {activity.meeting.village}
            </Info>
          )}
          {activity.meeting.businessPotential && (
            <Info label="Business Potential">
              {activity.meeting.businessPotential}
            </Info>
          )}
        </Section>
      )}

      {/* SAMPLE DETAILS */}
      {activity.sample && (
        <Section title="Sample Distribution">
          <Info label="Product">
            {activity.sample.productName}
          </Info>
          <Info label="Quantity">
            {activity.sample.quantity}
          </Info>
          <Info label="Purpose">
            {activity.sample.purpose}
          </Info>
        </Section>
      )}

      {/* SALE DETAILS */}
{activity.sale && (
  <Section title="Sale Details">
    <Info label="Customer Name">
      {activity.sale.customerName}
    </Info>

    {activity.sale.customerCategory && (
      <Info label="Customer Category">
        {activity.sale.customerCategory}
      </Info>
    )}

    <Info label="Mode">
      {activity.sale.mode}
    </Info>

    <Info label="Product">
      {activity.sale.productId}
    </Info>

    <Info label="Quantity">
      {activity.sale.quantity}
    </Info>

    {"isFollowUpSale" in activity.sale && (
      <Info label="Follow-up Sale">
        {activity.sale.isFollowUpSale ? "Yes" : "No"}
      </Info>
    )}

    <Info label="Repeat Order">
      {activity.sale.isRepeatOrder ? "Yes" : "No"}
    </Info>

    {activity.sale.amount && (
      <Info label="Amount (₹)">
        ₹{activity.sale.amount}
      </Info>
    )}
  </Section>
)}

      {/* NOTES */}
      {activity.notes && (
        <Section title="Notes">
          <p className="text-sm">{activity.notes}</p>
        </Section>
      )}

      {/* IMAGES */}
      {activity.photos?.length > 0 && (
        <Section title="Photos">
          <div className="grid grid-cols-2 gap-2">
            {activity.photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Activity"
                className="rounded border object-cover"
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="bg-white p-3 rounded shadow space-y-1">
        {children}
      </div>
    </div>
  );
}

function Info({ label, children }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span>{" "}
      {children}
    </p>
  );
}

function formatType(type) {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}
