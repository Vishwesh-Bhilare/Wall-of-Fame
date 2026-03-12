"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatsCard from "@/components/dashboard/StatsCard";

type ReportType = "monthly" | "yearly" | "achievements" | "students";

type AchievementRow = {
  id: string;
  status: "approved" | "pending" | "rejected";
  type: string;
};

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("monthly");
  const [rows, setRows] = useState<AchievementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRows = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("achievements")
        .select("id,status,type");

      if (!error && data) setRows(data as AchievementRow[]);

      setLoading(false);
    };

    loadRows();
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const approved = rows.filter((r) => r.status === "approved").length;
    const rejected = rows.filter((r) => r.status === "rejected").length;

    return { total, pending, approved, rejected };
  }, [rows]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();

    rows.forEach((r) => {
      map.set(r.type, (map.get(r.type) || 0) + 1);
    });

    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const generateReport = () => {
    alert(`Generating ${reportType} report...`);
  };

  const exportReport = (format: "CSV" | "PDF" | "Excel") => {
    alert(`Exporting ${reportType} report as ${format}...`);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">
            Admin Analytics
          </p>
          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
            Reports Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Generate summary reports and review achievement trends.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Achievements" value={stats.total} color="text-gray-900" />
          <StatsCard title="Pending Review" value={stats.pending} color="text-amber-700" />
          <StatsCard title="Approved" value={stats.approved} color="text-emerald-700" />
          <StatsCard title="Rejected" value={stats.rejected} color="text-rose-700" />
        </div>

        <Card>
          <h2 className="text-lg font-bold text-gray-900">Select Report Type</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              { id: "monthly", label: "Monthly Report" },
              { id: "yearly", label: "Yearly Report" },
              { id: "achievements", label: "Achievements" },
              { id: "students", label: "Student Activity" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setReportType(item.id as ReportType)}
                className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${
                  reportType === item.id
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-red-50/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Generate Report</h2>
              <Button onClick={generateReport}>Generate</Button>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              Selected type:
              <span className="font-semibold capitalize text-red-700">
                {" "}{reportType}
              </span>
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => exportReport("CSV")}>
                Export CSV
              </Button>
              <Button variant="secondary" onClick={() => exportReport("PDF")}>
                Export PDF
              </Button>
              <Button variant="secondary" onClick={() => exportReport("Excel")}>
                Export Excel
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-gray-900">
              Category Distribution
            </h2>

            {loading ? (
              <p className="mt-4 text-sm text-gray-500">
                Loading analytics...
              </p>
            ) : categoryBreakdown.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No achievement data available.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {categoryBreakdown.slice(0, 6).map(([type, count]) => (
                  <li
                    key={type}
                    className="flex items-center justify-between rounded-lg bg-red-50/50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-700">{type}</span>
                    <span className="font-bold text-red-700">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}