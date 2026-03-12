"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function StudentLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Student Login
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Access your achievement dashboard
        </p>

        <div className="space-y-5">

          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="College Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
            hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Student Achievement Portal
        </p>

      </div>

    </div>
  );
}