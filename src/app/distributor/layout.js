"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/page";
import MobileNavbar from "@/components/mobilenavbar/page";

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
    <div className="flex flex-col">


      {/* Main Content */}
      <main className="flex-1 p-4">
        <Navbar/>
        {children}  
        <MobileNavbar/>
      </main>

      {/* Bottom Navigation */}
      
    </div>
  );
}