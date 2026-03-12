"use client";

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