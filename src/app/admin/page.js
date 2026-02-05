"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    range: "MONTH",
    state: "ALL",
    district: "ALL",
  });

  useEffect(() => {
    const params = new URLSearchParams(filters);
  
    fetch(`/api/admin/dashboard?${params.toString()}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setData);
  }, [filters]);
  

  if (!data) return <p className="p-4">Loading dashboard…</p>;

  const {
    kpis,
    b2bVsB2c,
    orderSplit,
    productSales,
    customerCategorySplit,
    conversion,
    stateWiseSales,
    distributorPerformance,
  } = data;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* FILTERS */}
<div className="flex flex-wrap gap-4">
  <select
    value={filters.range}
    onChange={e =>
      setFilters({ ...filters, range: e.target.value })
    }
    className="border p-2 rounded"
  >
    <option value="TODAY">Today</option>
    <option value="MONTH">This Month</option>
    <option value="YEAR">This Year</option>
  </select>

  <select
    value={filters.state}
    onChange={e =>
      setFilters({
        ...filters,
        state: e.target.value,
        district: "ALL",
      })
    }
    className="border p-2 rounded"
  >
    <option value="ALL">All States</option>
    {(data.states || []).map(s => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>

  <select
    value={filters.district}
    onChange={e =>
      setFilters({ ...filters, district: e.target.value })
    }
    className="border p-2 rounded"
  >
    <option value="ALL">All Districts</option>
    {(data.districts || []).map(d => (
      <option key={d} value={d}>{d}</option>
    ))}
  </select>
</div>


      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <KPI label="Distributors" value={kpis.distributors} />
        <KPI label="Active Today" value={kpis.activeToday} />
        <KPI label="Meetings" value={kpis.meetings} />
        <KPI label="Samples" value={kpis.samples} />
        <KPI label="Sales" value={kpis.sales} />
        <KPI label="Distance (km)" value={kpis.distance} />
      </div>

      {/* SALES & CONVERSION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="B2C vs B2B Sales">
          <PieChartBox data={b2bVsB2c} />
        </ChartCard>

        <ChartCard title="New vs Repeat Orders">
  <PieChartBox data={orderSplit} />
</ChartCard>
      </div>

      {/* PRODUCT & CUSTOMER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Product-wise Sales">
          <BarChartBox
            data={productSales}
            bars={["quantity"]}
          />
        </ChartCard>

        <ChartCard title="Customer Category Split">
          <PieChartBox data={customerCategorySplit} />
        </ChartCard>
      </div>

      {/* CONVERSION */}
      <ChartCard title="Meeting → Sale Conversion">
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data.conversionFunnel || []}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>


      


<ChartCard title="Sample → Sale Conversion">
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data.conversionFunnel || []}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>


      {/* STATE / DISTRICT */}
      <ChartCard title="State-wise Sales">
        <BarChartBox
          data={stateWiseSales}
          bars={["sales"]}
        />
      </ChartCard>

      {/* DISTRIBUTOR PERFORMANCE */}
      <ChartCard title="Distributor Performance">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={distributorPerformance}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="meetings" />
            <Bar dataKey="sales" />
            <Bar dataKey="distance" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

function KPI({ label, value }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}

function PieChartBox({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" label />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BarChartBox({ data, bars }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {bars.map(b => (
          <Bar key={b} dataKey={b} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
