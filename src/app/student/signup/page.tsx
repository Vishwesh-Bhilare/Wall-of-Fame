"use client";

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