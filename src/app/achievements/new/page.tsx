"use client";

import Link from "next/link";
import AchievementForm from "@/components/achievements/AchievementForm";

export default function NewAchievementPage() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Submission</p>
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl">Submit New Achievement</h1>
          </div>

          <Link href="/achievements" className="brand-button-secondary">
            Back
          </Link>
        </div>

        <AchievementForm />
      </div>
    </div>
  );
}
