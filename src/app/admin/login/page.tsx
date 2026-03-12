"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please enter admin email and password");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    const { data: profile, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) {
      alert("Error checking admin role");
      setLoading(false);
      return;
    }

    if (profile.role !== "admin" && profile.role !== "head_admin") {
      alert("You are not authorized as admin");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#300409]/85 via-[#5d0814]/80 to-[#8f1225]/75" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-10">
            <span className="mb-4 inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Admin Review Console
            </span>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">Secure access for verification team</h1>
            <p className="mt-2 max-w-md text-sm text-red-50 md:text-base">
              Validate submissions, maintain quality, and keep the Wall of Fame trusted and authentic.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-gradient-to-b from-white to-red-50/60 p-6 md:p-10">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 shadow-lg md:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Admin Login</h2>
            <p className="mt-1 text-sm text-gray-600">Authorized admins only.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-email" className="brand-label">
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  className="brand-input"
                  placeholder="admin@mmcoe.edu.in"
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
                  className="brand-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button onClick={login} disabled={loading} className="brand-button w-full disabled:opacity-60">
                {loading ? "Checking access..." : "Login as Admin"}
              </button>
            </div>

            <div className="mt-5 text-sm">
              <Link href="/" className="text-gray-600 hover:text-red-700 hover:underline">
                Back to Wall of Fame
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    // Check role in users table
    const { data: profile, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) {
      alert("Error checking admin role");
      return;
    }

    if (profile.role !== "admin" && profile.role !== "head_admin") {
      alert("You are not authorized as admin");
      return;
    }

    // Redirect to admin dashboard
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4">

        <h2 className="text-2xl font-bold text-center">
          Admin Login
        </h2>

        <input
          className="border w-full p-3 rounded"
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-3 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-green-600 text-white w-full py-3 rounded hover:bg-green-700"
        >
          Login
        </button>

      </div>

    </div>
  );
}
