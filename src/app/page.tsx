"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AchievementCard from "@/components/achievements/AchievementCard";
import { getPublicApprovedAchievements } from "@/services/achievementService";
import type { Achievement } from "@/types/achievement";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title">("latest");

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchVerifiedAchievements = async (showLoader = false) => {
      if (showLoader) setLoading(true);

      const { data } = await getPublicApprovedAchievements();

      if (mounted) {
        setAchievements(data || []);
        if (showLoader) setLoading(false);
      }
    };

    const init = async () => {
      await fetchVerifiedAchievements(true);

      channel = supabase
        .channel("public-wall-live")
        .on("postgres_changes", { event: "*", schema: "public", table: "achievements" }, () => {
          fetchVerifiedAchievements(false);
        })
        .subscribe();
    };

    init();

    const intervalId = window.setInterval(() => {
      fetchVerifiedAchievements(false);
    }, 10000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const filteredAchievements = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = achievements.filter((a) => {
      if (!query) return true;
      return [a.title, a.type, a.description || "", a.rank || "", a.academic_year || "", a.submitter_email || ""].join(" ").toLowerCase().includes(query);
    });

    return next.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);

      const tA = new Date(a.created_at || 0).getTime();
      const tB = new Date(b.created_at || 0).getTime();
      return sortBy === "latest" ? tB - tA : tA - tB;
    });
  }, [achievements, search, sortBy]);

  const stats = useMemo(
    () => ({
      total: achievements.length,
      categories: new Set(achievements.map((a) => a.type)).size,
    }),
    [achievements]
  );

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://image3.mouthshut.com/images/imagesp/925718624s.png"
            alt="MMCOE logo"
            className="h-12 w-12 rounded-full border border-red-100 bg-white object-contain p-1"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">MMCOE</p>
            <h1 className="text-lg font-extrabold text-gray-900">Wall of Fame</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/student/login" className="brand-button-secondary px-4 py-2 text-sm">
            Student Login
          </Link>
          <Link href="/student/signup" className="brand-button-secondary px-4 py-2 text-sm">
            Student Signup
          </Link>
          <Link href="/admin/login" className="brand-button px-4 py-2 text-sm">
            Admin Login
          </Link>
        </div>
      </header>

      <section className="mx-auto mt-6 grid w-full max-w-7xl gap-6 md:grid-cols-[1fr_auto]">
        <div className="brand-card overflow-hidden border-red-100">
          <div className="relative h-full min-h-[240px]">
            <img
              src="https://i.ytimg.com/vi/96KWizV6gu4/maxresdefault.jpg"
              alt="MMCOE campus"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#5e0712]/85 via-[#8c1022]/70 to-[#b11226]/65" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
              <span className="brand-badge mb-3 w-fit border border-white/20 bg-white/15 text-white">Verified showcase only</span>

              <h2 className="text-2xl font-black md:text-4xl">Celebrating Excellence at MMCOE</h2>

              <p className="mt-2 max-w-3xl text-sm text-red-50 md:text-base">
                This wall displays only admin-verified student achievements in academics, innovation, research, sports, and extracurricular impact.
              </p>
            </div>
          </div>
        </div>

        <aside className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <div className="brand-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Verified Posts</p>
            <p className="mt-1 text-2xl font-black text-gray-900">{stats.total}</p>
          </div>

          <div className="brand-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Categories</p>
            <p className="mt-1 text-2xl font-black text-gray-900">{stats.categories}</p>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-gray-900 md:text-2xl">Verified Wall Posts</h3>

          <Link href="/achievements" className="text-sm font-semibold text-red-700 hover:underline">
            
          </Link>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, type, description, rank, year, email..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "title")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <option value="latest">Sort: Latest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
        </div>

        {loading ? (
          <div className="brand-card p-8 text-center text-gray-500">Loading verified achievements...</div>
        ) : filteredAchievements.length === 0 ? (
          <div className="brand-card p-8 text-center text-gray-500">No matching verified posts found.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((item) => (
              <AchievementCard
                key={item.id}
                id={item.id}
                title={item.title}
                type={item.type}
                status={item.status}
                rank={item.rank}
                description={item.description}
                academicYear={item.academic_year}
                accomplishmentDate={item.accomplishment_date}
                submitterEmail={item.submitter_email}
                createdAt={item.created_at}
                ctaLabel="View details"
                certificateUrl={
                  item.certificate
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${item.certificate}`
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
