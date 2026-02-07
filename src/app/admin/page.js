"use client";

import { useEffect, useState } from "react";

import Map from './map/page'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  Zap,
  MapPin,
  TrendingUp,
  Package,
  Navigation,
  ChevronDown,
  Download,
  MousePointer2,
} from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

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
      .then((res) => res.json())
      .then(setData);
  }, [filters]);

  async function generateAiSummary() {
    try {
      setAiLoading(true);
      setAiSummary(null);

      const res = await fetch("/api/admin/analytics/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          filters: {
            range: filters.range,
            state: filters.state,
            district: filters.district,
          },
          metrics: {
            meetings: data.kpis.meetings,
            samples: data.kpis.samples,
            sales: data.kpis.sales,
            b2c: data.b2bVsB2c?.find((x) => x.name === "B2C")?.value || 0,
            b2b: data.b2bVsB2c?.find((x) => x.name === "B2B")?.value || 0,
          },
          productSales: data.productSales,
          distributorPerformance: data.distributorPerformance,
        }),
      });

      const result = await res.json();
      setAiSummary(result.summary);
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI summary");
    } finally {
      setAiLoading(false);
    }
  }

  function parseAISummary(text) {
    if (!text) return [];

    const sections = [];
    const blocks = text.split(/\n\s*\n/); // paragraph based

    blocks.forEach((block) => {
      const lines = block.split("\n").filter(Boolean);
      if (!lines.length) return;

      const title = lines[0].replace(/[:\-]/g, "").toUpperCase();
      const content = lines.slice(1);

      sections.push({
        title,
        content,
      });
    });

    return sections;
  }

  const downloadCSV = () => {
    if (!data) return;

    const rows = [];

    rows.push(["SECTION", "EXECUTIVE SUMMARY"]);
    rows.push(["Metric", "Value"]);
    Object.entries(data.kpis).forEach(([key, val]) => rows.push([key, val]));
    rows.push([]);

    rows.push(["SECTION", "DISTRIBUTION SPLIT"]);
    rows.push(["Category", "Value"]);
    data.b2bVsB2c.forEach((item) => rows.push([item.name, item.value]));
    rows.push([]);

    rows.push(["SECTION", "PRODUCT PERFORMANCE"]);
    rows.push(["Product Name", "Quantity"]);
    data.productSales.forEach((item) => rows.push([item.name, item.quantity]));
    rows.push([]);

    rows.push(["SECTION", "DISTRIBUTOR MATRIX"]);
    rows.push(["Name", "Meetings", "Sales", "Distance"]);
    data.distributorPerformance.forEach((item) =>
      rows.push([item.name, item.meetings, item.sales, item.distance]),
    );

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Analytics_Report_${filters.range}_${new Date().toLocaleDateString()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data) return <ShimmerLoader />;

  const {
    kpis,
    b2bVsB2c,
    orderSplit,
    productSales,
    customerCategorySplit,
    stateWiseSales,
    distributorPerformance,
  } = data;

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-[-apple-system,BlinkMacSystemFont,sans-serif] pb-32 md:pb-20 antialiased">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] md:w-[40%] h-[40%] bg-emerald-200/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[60%] md:w-[30%] h-[30%] bg-blue-200/20 blur-[100px] rounded-full" />
      </div>

      <header className="sticky rounded-2xl top-0 z-50 px-4 md:px-8 pt-8 md:pt-10 pb-6 bg-white/60 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1 leading-none">
                Intelligence
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                Dashboard
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Download CSV – secondary on mobile */}
              <button
                onClick={downloadCSV}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Download full report</span>
                <span className="sm:hidden">Download</span>
              </button>

              {/* AI Summary – primary */}
              <button
                onClick={generateAiSummary}
                disabled={aiLoading}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-xl active:scale-95 disabled:opacity-60"
              >
                {aiLoading ? "Analyzing…" : "AI Summary"}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="bg-white/60 p-1 rounded-2xl border border-white flex shadow-sm backdrop-blur-md">
              {["TODAY", "MONTH", "YEAR"].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters({ ...filters, range: r })}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                    filters.range === r
                      ? "bg-black text-white shadow-lg"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>


            <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              <SelectWrapper icon={<MapPin size={14} />}>
                <select
                  value={filters.state}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      state: e.target.value,
                      district: "ALL",
                    })
                  }
                  className="bg-transparent appearance-none pr-8 focus:outline-none font-bold text-xs cursor-pointer"
                >
                  <option value="ALL">All States</option>
                  {(data.states || []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </SelectWrapper>

              <SelectWrapper icon={<FilterIcon />}>
                <select
                  value={filters.district}
                  onChange={(e) =>
                    setFilters({ ...filters, district: e.target.value })
                  }
                  className="bg-transparent appearance-none pr-8 focus:outline-none font-bold text-xs cursor-pointer"
                >
                  <option value="ALL">All Districts</option>
                  {(data.districts || []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-6 md:space-y-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPI
            label="Distributors"
            value={kpis.distributors}
            icon={<Users size={18} />}
            color="bg-blue-500"
          />
          <KPI
            label="Active Today"
            value={kpis.activeToday}
            icon={<Zap size={18} />}
            color="bg-emerald-500"
          />
          <KPI
            label="Meetings"
            value={kpis.meetings}
            icon={<TrendingUp size={18} />}
            color="bg-violet-500"
          />
          <KPI
            label="Samples"
            value={kpis.samples}
            icon={<Package size={18} />}
            color="bg-amber-500"
          />
          <KPI
            label="Sales"
            value={kpis.sales}
            icon={<TrendingUp size={18} />}
            color="bg-rose-500"
          />
          <KPI
            label="Distance"
            value={`${kpis.distance}KM`}
            icon={<Navigation size={18} />}
            color="bg-slate-800"
          />
        </div>
        <Map/>
        {aiSummary && (
          <div className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center">
                AI
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                AI Executive Summary
              </h2>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {parseAISummary(aiSummary).map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Heading – SINGLE STYLE */}
                  <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600">
                    {sec.title}
                  </h3>

                  {/* Content – SINGLE STYLE */}
                  <ul className="space-y-2">
                    {sec.content.map((line, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-slate-700 leading-relaxed"
                      >
                        <span className="text-slate-400">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="B2C vs B2B Sales">
            <PieChartBox data={b2bVsB2c} />
          </ChartCard>
          <ChartCard title="New vs Repeat Orders">
            <PieChartBox data={orderSplit} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Product-wise Sales">
            <BarChartBox
              data={productSales}
              barKey="quantity"
              color="#10b981"
            />
          </ChartCard>
          <ChartCard title="Customer Category">
            <PieChartBox data={customerCategorySplit} innerRadius={60} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Meeting → Sale Conversion">
            <BarChartBox
              data={data.conversionFunnel || []}
              barKey="value"
              color="#3b82f6"
            />
          </ChartCard>
          <ChartCard title="Sample → Sale Conversion">
            <BarChartBox
              data={data.conversionFunnel || []}
              barKey="value"
              color="#f59e0b"
            />
          </ChartCard>
        </div>

        <ChartCard title="State-wise Sales Distribution">
          <BarChartBox data={stateWiseSales} barKey="sales" color="#10b981" />
        </ChartCard>

        <ChartCard title="Performance Matrix (Distributors)">
          <div className="h-[400px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributorPerformance} barGap={8}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  content={<CustomTooltip />}
                />
                <Bar
                  dataKey="meetings"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="sales"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="distance"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </main>
    </div>
  );
}

function ShimmerLoader() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] p-8 space-y-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="h-10 w-64 bg-slate-300 rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white/60 rounded-[2.5rem] border border-white"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[400px] bg-white/60 rounded-[3rem] border border-white" />
          <div className="h-[400px] bg-white/60 rounded-[3rem] border border-white" />
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, icon, color }) {
  return (
    <div className="group bg-white/40 backdrop-blur-3xl border border-white/60 p-6 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
      <div
        className={`${color} w-11 h-11 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-inherit/20`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-black tracking-tight text-slate-900 mb-8">
        {title}
      </h2>
      {children}
    </div>
  );
}

function PieChartBox({ data, innerRadius = 0 }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function BarChartBox({ data, barKey, color }) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 700 }}
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
          <Tooltip cursor={{ fill: "#f1f5f9" }} content={<CustomTooltip />} />
          <Bar
            dataKey={barKey}
            fill={color}
            radius={[8, 8, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SelectWrapper({ children, icon }) {
  return (
    <div className="relative flex items-center bg-white/60 px-5 py-3 rounded-2xl border border-white shadow-sm backdrop-blur-md">
      <span className="text-slate-400 mr-2">{icon}</span>
      {children}
      <ChevronDown
        size={14}
        className="absolute right-4 pointer-events-none text-slate-400"
      />
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/20">
        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">
          {payload[0].name || payload[0].payload.name}
        </p>
        <p className="text-lg font-black tabular-nums">{payload[0].value}</p>
      </div>
    );
  }
  return null;
}
