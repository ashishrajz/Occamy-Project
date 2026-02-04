"use client";

import { useEffect, useState } from "react";
import StatsCards from "./stats";
import CalendarView from "./calendar";
import MonthlySummary from "./monthly";

export default function DistributorProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch profile info
  useEffect(() => {
    fetch("/api/distributor/profile", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setProfile);
  }, []);

  // Fetch stats
  useEffect(() => {
    fetch("/api/distributor/stats", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setStats);
  }, []);

  async function uploadPhoto(file) {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(
      "/api/distributor/profile/avatar",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const data = await res.json();

    setProfile(prev => ({
      ...prev,
      avatar: data.avatar,
    }));

    setUploading(false);
  }

  if (!profile) {
    return <p className="p-4">Loading profile...</p>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <h1 className="text-xl font-semibold">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white p-4 rounded shadow flex gap-4 items-center">
        <img
          src={
            profile.avatar ||
            "https://via.placeholder.com/100?text=Avatar"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div className="flex-1 space-y-1">
          <p className="text-lg font-medium">{profile.name}</p>
          <p className="text-sm text-gray-600">
            📞 {profile.phone}
          </p>
          <p className="text-sm text-gray-500">
            Role: {profile.role}
          </p>

          <label className="inline-block mt-2 text-sm text-blue-600 cursor-pointer">
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => uploadPhoto(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {/* Stats */}
      {stats ? (
        <>
          <h2 className="font-semibold">Overall Stats</h2>
          <StatsCards stats={stats} />
        </>
      ) : (
        <p>Loading stats...</p>
      )}

      {/* Calendar */}
      <CalendarView />

      {/* Monthly Summary */}
      <MonthlySummary />
    </div>
  );
}
