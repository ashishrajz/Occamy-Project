import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Occamy Field Operations
        </h1>
        <p className="text-gray-600 mt-2 text-sm max-w-xs mx-auto">
          Mobile-first platform to log on-ground activities, meetings,
          samples, and sales across rural regions.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <Link href="/auth/login">
          <button className="w-full py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
            Login
          </button>
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-500 text-center max-w-xs">
        Internal operations system for distributors, admins, and farmers.
      </p>

    </main>
  );
}
