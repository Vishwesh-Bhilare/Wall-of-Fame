"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ReviewPanel from "../ReviewPanel";
import StatsCard from "@/components/dashboard/StatsCard";

type Achievement = {
  id: string;
  title: string;
  type: string;
  status: "approved" | "pending" | "rejected";
  certificate?: string;
  profiles?: { name?: string } | null;
};

export default function AdminDashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("id,title,type,status,certificate,profiles(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setAchievements((data as Achievement[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const pendingItems = achievements.filter((a) => a.status === "pending");

  const stats = useMemo(() => {
    const approved = achievements.filter((a) => a.status === "approved").length;
    const rejected = achievements.filter((a) => a.status === "rejected").length;
    const pending = achievements.filter((a) => a.status === "pending").length;

    return {
      total: achievements.length,
      approved,
      pending,
      rejected,
    };
  }, [achievements]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("achievements")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAchievements();
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">
            Admin
          </p>

          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
            Review & Verification Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Approve or reject student submissions before publishing to the Wall of Fame.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Submissions" value={stats.total} color="text-gray-900" />
          <StatsCard title="Pending" value={stats.pending} color="text-amber-700" />
          <StatsCard title="Approved" value={stats.approved} color="text-emerald-700" />
          <StatsCard title="Rejected" value={stats.rejected} color="text-rose-700" />
        </div>

        <div className="mt-7">
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            Pending Reviews
          </h2>

          {loading ? (
            <div className="brand-card p-8 text-center text-gray-500">
              Loading submissions...
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="brand-card p-8 text-center text-gray-500">
              No pending achievements. Great job!
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingItems.map((a) => (
                <ReviewPanel
                  key={a.id}
                  title={a.title}
                  student={a.profiles?.name || "Unknown Student"}
                  type={a.type}
                  status={a.status}
                  certificateUrl={
                    a.certificate
                      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${a.certificate}`
                      : undefined
                  }
                  onApprove={() => updateStatus(a.id, "approved")}
                  onReject={() => updateStatus(a.id, "rejected")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}