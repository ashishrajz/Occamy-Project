"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StatsCards from "@/app/distributor/profile/stats";
import AdminCalendar from "./AdminCalendar";
import AdminMonthly from "./AdminMonthly";

export default function AdminDistributorProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/distributor/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile);
        setStats(data.stats);
      });
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Distributor Profile
      </h1>

      <div className="bg-white p-4 rounded shadow flex gap-4">
        <img
          src={
            profile.avatar ||
            "https://via.placeholder.com/80"
          }
          className="w-20 h-20 rounded-full"
        />
        <div>
          <p className="font-medium">{profile.name}</p>
          <p className="text-sm">{profile.phone}</p>
          <p className="text-xs text-gray-500">
            Role: {profile.role}
          </p>
        </div>
      </div>

      {stats && (
        <>
          <h2 className="font-semibold">
            Performance Overview
          </h2>
          <StatsCards stats={stats} />
        </>
      )}

<AdminCalendar distributorId={id} />
<AdminMonthly distributorId={id} />
    </div>
  );
}
