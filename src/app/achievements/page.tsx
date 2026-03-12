"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import AchievementCard from "@/components/achievements/AchievementCard";
import { getAchievements } from "@/services/achievementService";
import type { Achievement } from "@/types/achievement";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "status">("latest");

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    const fetchAchievements = async (userId?: string, showLoader = false) => {
      if (showLoader) setLoading(true);

      let activeUserId = userId;
      if (!activeUserId) {
        const { data: userData } = await supabase.auth.getUser();
        activeUserId = userData?.user?.id;
      }

      if (!activeUserId) {
        if (showLoader && isMounted) setLoading(false);
        return;
      }

      const { data } = await getAchievements(activeUserId);

      if (!isMounted) return;

      setAchievements(data || []);
      if (showLoader) setLoading(false);
    };

    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      await fetchAchievements(user.id, true);

      channel = supabase
        .channel(`my-achievements-${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "achievements", filter: `user_id=eq.${user.id}` },
          () => fetchAchievements(user.id),
        )
        .subscribe();

      intervalId = setInterval(() => {
        fetchAchievements(user.id);
      }, 10000);
    };

    init();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const filteredAchievements = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = achievements.filter((a) => {
      if (!query) return true;
      return [a.title, a.type, a.description || "", a.rank || "", a.status].join(" ").toLowerCase().includes(query);
    });

    return next.sort((a, b) => {
      if (sortBy === "status") return a.status.localeCompare(b.status);
      const tA = new Date(a.created_at || 0).getTime();
      const tB = new Date(b.created_at || 0).getTime();
      return sortBy === "latest" ? tB - tA : tA - tB;
    });
  }, [achievements, search, sortBy]);

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

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "status")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>

        {loading ? (
          <div className="brand-card p-8 text-center text-gray-500">Loading achievements...</div>
        ) : filteredAchievements.length === 0 ? (
          <div className="brand-card p-8 text-center text-gray-500">No achievements submitted yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((a) => (
              <AchievementCard
                key={a.id}
                id={a.id}
                title={a.title}
                type={a.type}
                status={a.status}
                description={a.description}
                rank={a.rank}
                createdAt={a.created_at}
                certificateUrl={
                  a.certificate
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${a.certificate}`
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
