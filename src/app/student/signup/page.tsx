"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function StudentSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Signup successful! Please check your email for verification.");
    setLoading(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_30px_80px_rgba(177,18,38,0.16)] md:grid-cols-[0.95fr_1fr]">
        <section className="flex items-center justify-center bg-gradient-to-b from-white to-red-50/60 p-6 md:p-10">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 shadow-lg md:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Student Signup</h2>
            <p className="mt-1 text-sm text-gray-600">Create your MMCOE Wall of Fame account.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="signup-email" className="brand-label">
                  College Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@mmcoe.edu.in"
                  className="brand-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="brand-label">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a strong password"
                  className="brand-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="signup-confirm" className="brand-label">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm"
                  type="password"
                  placeholder="Re-enter password"
                  className="brand-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button onClick={signup} disabled={loading} className="brand-button w-full disabled:opacity-60">
                {loading ? "Creating account..." : "Create Student Account"}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <Link href="/student/login" className="font-semibold text-red-700 hover:underline">
                Already have account?
              </Link>
              <Link href="/" className="text-gray-600 hover:text-red-700 hover:underline">
                Back to Wall
              </Link>
            </div>
          </div>
        </section>

        <section className="relative min-h-[320px] md:min-h-[620px]">
          <img
            src="https://i.ytimg.com/vi/96KWizV6gu4/maxresdefault.jpg"
            alt="MMCOE"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#57060f]/80 via-[#7c0b1b]/70 to-[#b11226]/70" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white md:p-10">
            <span className="mb-4 inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Build your profile
            </span>
            <h3 className="text-3xl font-black leading-tight md:text-4xl">
              One account to submit and track every achievement
            </h3>
            <p className="mt-2 max-w-md text-sm text-red-50 md:text-base">
              Join the platform and make your innovations, competitions, and impactful work visible.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function StudentSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert("Signup successful! Please check your email.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Student Signup
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Create your achievement portal account
        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="College Email"
            className="w-full border border-gray-300 p-3 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 p-3 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={signup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
            hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Student Achievement Portal
        </p>

      </div>

    </div>
  );
}
