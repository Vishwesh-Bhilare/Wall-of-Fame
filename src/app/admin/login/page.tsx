"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { UserRole } from "@/types/user";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        alert(error.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Unable to fetch authenticated user.");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const role = profile?.role as UserRole | undefined;
      const isAdmin = role === "admin" || role === "head_admin";

      if (!isAdmin) {
        await supabase.auth.signOut();
        alert("This account does not have admin access.");
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_30px_80px_rgba(177,18,38,0.16)] md:grid-cols-[1fr_0.95fr]">
        <section className="relative min-h-[300px] md:min-h-[620px]">
          <img
            src="https://i.ytimg.com/vi/96KWizV6gu4/maxresdefault.jpg"
            alt="MMCOE"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#57060f]/80 via-[#7c0b1b]/70 to-[#b11226]/70" />

          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white md:p-10">
            <div className="flex items-center gap-3">
              <img
                src="https://image3.mouthshut.com/images/imagesp/925718624s.png"
                alt="MMCOE Logo"
                className="h-12 w-12 rounded-full bg-white object-contain p-1"
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-100">
                  MMCOE
                </p>
                <p className="text-base font-bold">Admin Portal</p>
              </div>
            </div>

            <div>
              <span className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Verification Console
              </span>

              <h1 className="text-3xl font-black leading-tight md:text-4xl">
                Admin access only
              </h1>

              <p className="mt-2 max-w-md text-sm text-red-50 md:text-base">
                Review student submissions, approve valid entries, and publish verified achievements to the wall.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-gradient-to-b from-white to-red-50/60 p-6 md:p-10">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 shadow-lg md:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Admin Login</h2>

            <p className="mt-1 text-sm text-gray-600">Use your admin credentials.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-email" className="brand-label">
                  Admin Email
                </label>

                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@mmcoe.edu.in"
                  className="brand-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="brand-label">
                  Password
                </label>

                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  className="brand-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button onClick={login} disabled={loading} className="brand-button w-full disabled:opacity-60">
                {loading ? "Logging in..." : "Login as Admin"}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <Link href="/student/login" className="font-semibold text-red-700 hover:underline">
                Student login
              </Link>

              <Link href="/" className="text-gray-600 hover:text-red-700 hover:underline">
                Back to Wall
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
