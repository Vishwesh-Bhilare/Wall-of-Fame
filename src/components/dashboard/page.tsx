"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import StatsCard from "@/components/dashboard/StatsCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import type { UserRole } from "@/types/user";

type AchievementRow = {
  id: string;
  type: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const [activities, setActivities] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      const role = profile?.role as UserRole | undefined;

      if (role !== "admin" && role !== "head_admin") {
        router.replace("/student/login");
        return;
      }

      await fetchData();

      channel = supabase
        .channel("normal-admin-dashboard")
        .on("postgres_changes", { event: "*", schema: "public", table: "achievements" }, () => {
          fetchData(false);
        })
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("id,title,type,status,created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (error || !data) {
      if (showLoading) setLoading(false);
      return;
    }

    const rows = data as AchievementRow[];

    const total = rows.length;
    const pending = rows.filter((a) => a.status === "pending").length;
    const approved = rows.filter((a) => a.status === "approved").length;
    const rejected = rows.filter((a) => a.status === "rejected").length;

    setStats({ total, pending, approved, rejected });

    const activityData = rows.slice(0, 5).map((a) => ({
      id: a.id,
      message: `${a.status === "pending" ? "Pending" : "Updated"} ${a.type} submission: ${a.title}`,
    }));

    setActivities(activityData);
    if (showLoading) setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen p-10 text-gray-500">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-10 grid grid-cols-4 gap-6">
        <StatsCard title="Total Achievements" value={stats.total} />
        <StatsCard title="Pending" value={stats.pending} color="text-yellow-500" />
        <StatsCard title="Approved" value={stats.approved} color="text-green-600" />
        <StatsCard title="Rejected" value={stats.rejected} color="text-red-600" />
      </div>

      <ActivityFeed activities={activities} />
    </div>
  );
}
