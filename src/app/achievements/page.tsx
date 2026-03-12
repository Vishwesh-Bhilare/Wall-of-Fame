"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import AchievementCard from "@/components/achievements/AchievementCard";
import { getAchievements } from "@/services/achievementService";
import type { Achievement } from "@/types/achievement";

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

      const { data } = await getAchievements(user.id);

      setAchievements(data || []);
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
              <AchievementCard
                key={a.id}
                id={a.id}
                title={a.title}
                type={a.type}
                status={a.status}
                description={a.description}
                rank={a.rank}
                createdAt={a.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
