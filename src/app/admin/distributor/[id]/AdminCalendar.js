"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCalendar({ distributorId }) {
  const [days, setDays] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetch(
      `/api/admin/distributor-calendar?distributorId=${distributorId}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(data => {
        setDays(Array.isArray(data) ? data : []);
      });
  }, [distributorId]);

  const presentDates = new Set(days.map(d => d.date));

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">
        Attendance Calendar
      </h2>

      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
          const present = presentDates.has(date);

          return (
            <div
              key={date}
              onClick={() => {
                if (present) {
                  router.push(
                    `/admin/distributor/${distributorId}/day/${date}`
                  );
                }
              }}
              className={`p-2 rounded cursor-pointer ${
                present
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-100 text-red-600 cursor-not-allowed"
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
