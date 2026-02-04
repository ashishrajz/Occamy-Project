"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("DISTRIBUTOR");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          role,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "DISTRIBUTOR") router.push("/distributor");


      // Role-based redirect
      if (data.user.role === "ADMIN") router.push("/admin");
      if (data.user.role === "DISTRIBUTOR") router.push("/distributor");
      if (data.user.role === "FARMER") router.push("/farmer");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          Login
        </h2>

        {/* Role Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="ADMIN">Admin</option>
            <option value="FARMER">Farmer</option>
          </select>
        </div>

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-3 py-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone number"
          className="w-full border rounded px-3 py-2 mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="text-center text-xs text-gray-500 mb-2">
          OR
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email (Admin only)"
          className="w-full border rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Language */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
