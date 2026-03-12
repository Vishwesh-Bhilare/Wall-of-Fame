"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Achievement = {
  id: string;
  title: string;
  type: string;
  status: "approved" | "pending" | "rejected";
  description?: string;
  created_at?: string;
};

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("achievements")
        .select("id,title,type,status,description,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setAchievements((data as Achievement[]) || []);
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Student</p>
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl">My Achievements</h1>
          </div>
          <Link href="/achievements/new" className="brand-button">
            + New Submission
          </Link>
        </div>

        {loading ? (
          <div className="brand-card p-8 text-center text-gray-500">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="brand-card p-8 text-center text-gray-500">No achievements submitted yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => (
              <Link href={`/achievements/${a.id}`} key={a.id} className="brand-card p-5 transition hover:-translate-y-0.5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-gray-900">{a.title}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[a.status]}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-red-700">{a.type}</p>
                {a.description ? <p className="mt-2 text-sm text-gray-600">{a.description}</p> : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
