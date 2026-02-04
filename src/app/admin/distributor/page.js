"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDistributorsPage() {
  const [distributors, setDistributors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/distributor", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setDistributors);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        All Distributors
      </h1>

      {distributors.length === 0 && (
        <p className="text-gray-500">
          No distributors found
        </p>
      )}

      {distributors.map(d => (
        <div
          key={d._id}
          onClick={() =>
            router.push(`/admin/distributor/${d._id}`)
          }
          className="bg-white border rounded p-4 mb-2 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <img
              src={
                d.avatar ||
                "https://via.placeholder.com/40"
              }
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-sm text-gray-600">
                {d.phone}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
