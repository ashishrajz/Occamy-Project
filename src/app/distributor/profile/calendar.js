"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CalendarView() {
  const router = useRouter();
  const [presentDays, setPresentDays] = useState([]);

  useEffect(() => {
    fetch("/api/distributor/calendar", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setPresentDays);
  }, []);

  const presentDates = new Set(presentDays.map(d => d.date));
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const month = today.toISOString().slice(0, 7);

  return (
    <div>
      <h2 className="font-semibold mb-2">Attendance</h2>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          const present = presentDates.has(date);

          return (
            <div
              key={date}
              onClick={() =>
                present && router.push(`/distributor/profile/${date}`)
              }
              className={`p-2 text-center rounded cursor-pointer
                ${present ? "bg-green-500 text-white" : "bg-red-200"}
              `}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
