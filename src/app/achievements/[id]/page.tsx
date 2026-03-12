"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/helpers";
import { getAchievementById } from "@/services/achievementService";
import type { Achievement } from "@/types/achievement";
import MediaPreview from "@/components/achievements/MediaPreview";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function AchievementDetailPage() {
  const params = useParams<{ id: string }>();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievement = async () => {
      if (!params?.id) return;

      setLoading(true);
      const { data } = await getAchievementById(params.id);
      setAchievement(data);
      setLoading(false);
    };

    fetchAchievement();
  }, [params?.id]);

  const certificateUrl = useMemo(() => {
    if (!achievement?.certificate) return null;

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${achievement.certificate}`;
  }, [achievement?.certificate]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading achievement details...</div>;
  }

  if (!achievement) {
    return <div className="p-8 text-center text-gray-500">Achievement not found.</div>;
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">Achievement Details</h1>

          <Link href="/achievements" className="brand-button-secondary">
            Back
          </Link>
        </div>

        <div className="brand-card p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{achievement.title}</h2>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[achievement.status]}`}>
              {achievement.status}
            </span>
          </div>

          <div className="grid gap-4 text-sm text-gray-700 md:grid-cols-2">
            <p>
              <span className="font-semibold text-gray-900">Type:</span> {achievement.type}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Submitted:</span>{" "}
              {achievement.created_at ? formatDate(achievement.created_at) : "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Student:</span> {achievement.profiles?.name || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Department:</span> {achievement.profiles?.department || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Event / Platform:</span> {achievement.event_name || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Rank / ID:</span> {achievement.rank || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">DOI:</span> {achievement.doi || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Journal:</span> {achievement.journal_name || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Patent Number:</span> {achievement.patent_number || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">Copyright Number:</span> {achievement.copyright_number || "-"}
            </p>

            <p>
              <span className="font-semibold text-gray-900">GitHub:</span>{" "}
              {achievement.github ? (
                <a href={achievement.github} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">
                  Open link
                </a>
              ) : (
                "-"
              )}
            </p>

            <p>
              <span className="font-semibold text-gray-900">YouTube:</span>{" "}
              {achievement.youtube ? (
                <a href={achievement.youtube} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">
                  Open link
                </a>
              ) : (
                "-"
              )}
            </p>
          </div>

          <div className="mt-5 border-t border-red-50 pt-4">
            <p className="text-sm font-semibold text-gray-900">Description</p>

            <p className="mt-2 text-sm text-gray-700">{achievement.description || "No description provided."}</p>
          </div>

          {certificateUrl ? <MediaPreview url={certificateUrl} /> : null}
        </div>
      </div>
    </div>
  );
}
