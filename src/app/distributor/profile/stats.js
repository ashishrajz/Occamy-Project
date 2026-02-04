"use client";

export default function StatsCards({ stats }) {
  const cards = [
    { label: "Total Distance (km)", value: stats.totalDistance },
    { label: "Meetings", value: stats.meetingsCount },
    { label: "Farmers Contacted", value: stats.farmersContacted },
    { label: "Total Sales", value: stats.salesCount },
    { label: "B2C Sales", value: stats.b2c },
    { label: "B2B Sales", value: stats.b2b },
    { label: "Days Worked", value: stats.totalDaysWorked },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(c => (
        <div
          key={c.label}
          className="bg-white p-3 rounded shadow text-center"
        >
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className="text-lg font-semibold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
