"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify admin access
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(user => {
        if (!user || user.role !== "ADMIN") {
          router.replace("/auth/login");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.replace("/auth/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div className="p-4 text-gray-500">
        Checking admin access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-semibold text-lg">
          Admin Panel
        </h1>

        <nav className="flex gap-4 text-sm">
          <NavLink
            href="/admin"
            active={pathname === "/admin"}
          >
            Dashboard
          </NavLink>

          <NavLink
            href="/admin/distributor"
            active={pathname.startsWith("/admin/distributor")}
          >
            Distributors
          </NavLink>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
              });
              router.replace("/auth/login");
            }}
            className="text-red-600 font-medium"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* CONTENT */}
      <main className="p-4">{children}</main>
    </div>
  );
}

function NavLink({ href, active, children }) {
  return (
    <a
      href={href}
      className={`font-medium ${
        active
          ? "text-blue-600"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {children}
    </a>
  );
}
