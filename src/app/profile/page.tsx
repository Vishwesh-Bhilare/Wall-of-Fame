"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Profile = {
  id: string;
  email?: string;
  role?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievementCount, setAchievementCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { data: userProfile } = await supabase
        .from("users")
        .select("id,email,role")
        .eq("id", user.id)
        .maybeSingle();

      const { count } = await supabase
        .from("achievements")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      setProfile((userProfile as Profile) || { id: user.id, email: user.email || "", role: "student" });
      setAchievementCount(count || 0);
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">My Profile</h1>

        <div className="mt-5 grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
          <div className="brand-card p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Identity</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">Student Account</h2>

            <div className="mt-5 space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Email:</span> {profile?.email || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Role:</span> {profile?.role || "student"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Profile ID:</span> {profile?.id || "-"}
              </p>
            </div>
          </div>

          <div className="brand-card p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Snapshot</p>
            <p className="mt-2 text-4xl font-black text-gray-900">{achievementCount}</p>
            <p className="mt-1 text-sm text-gray-600">Total achievements submitted</p>
          </div>
        </div>
      </div>
    </div>
  );
}export default function ProfilePage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="bg-white p-6 rounded shadow mt-4">
        <p>User information and achievements will appear here.</p>
      </div>
    </div>
  );
}
