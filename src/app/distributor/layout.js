"use client";

import { useRouter } from "next/navigation";

export default function DistributorLayout({ children }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Bar */}
      <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-green-700">
          Distributor Panel
        </h1>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 font-medium"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t flex justify-around py-2 text-sm">
        <button onClick={() => router.push("/distributor")}>
          Home
        </button>
        <button onClick={() => router.push("/distributor/log-activity")}>
          Log Activity
        </button>
      </nav>
    </div>
  );
}
