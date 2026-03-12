"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ReviewPanel from "../ReviewPanel";
import type { UserRole } from "@/types/user";

type Achievement = {
  id: string;
  title: string;
  type: string;
  status: "approved" | "pending" | "rejected";
  description?: string;
  rank?: string;
  submitted_at?: string;
  academic_year?: string | null;
  accomplishment_date?: string | null;
  submitter_email?: string | null;
  certificate?: string;
  verified_by?: string | null;
  profiles?: { name?: string; email?: string } | null;
  verifier_profile?: { email?: string; name?: string } | null;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorizing, setAuthorizing] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title" | "status">("latest");

  const fetchAchievements = async (showLoader = true) => {
    if (showLoader) setLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("id,title,type,status,description,rank,submitted_at,academic_year,accomplishment_date,submitter_email,certificate,verified_by,profiles(name,email),verifier_profile:profiles!achievements_verified_by_fkey(name,email)")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      if (showLoader) setLoading(false);
      return;
    }

    setAchievements((data as Achievement[]) || []);
    if (showLoader) setLoading(false);
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    const verifyAdminAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

      const nextRole = profile?.role as UserRole | undefined;
      const isAdmin = nextRole === "admin" || nextRole === "head_admin";

      if (!isAdmin) {
        await supabase.auth.signOut();
        router.replace("/student/login");
        return;
      }

      setRole(nextRole || null);
      setAdminId(user.id);
      setAuthorizing(false);

      await fetchAchievements(true);
      if (!isMounted) return;

      channel = supabase
        .channel("admin-achievements-live")
        .on("postgres_changes", { event: "*", schema: "public", table: "achievements" }, () => {
          fetchAchievements(false);
        })
        .subscribe();

      intervalId = setInterval(() => {
        fetchAchievements(false);
      }, 8000);
    };

    verifyAdminAndLoad();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [router]);

  const pendingItems = achievements.filter((a) => a.status === "pending");

  const stats = useMemo(() => {
    const approved = achievements.filter((a) => a.status === "approved").length;
    const rejected = achievements.filter((a) => a.status === "rejected").length;
    const pending = achievements.filter((a) => a.status === "pending").length;

    return {
      total: achievements.length,
      approved,
      pending,
      rejected,
    };
  }, [achievements]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    achievements.forEach((item) => map.set(item.type, (map.get(item.type) || 0) + 1));
    return [...map.entries()].map(([label, value]) => ({ label, value }));
  }, [achievements]);

  const verifierData = useMemo(() => {
    const map = new Map<string, number>();
    achievements
      .filter((item) => item.status === "approved" && item.verifier_profile?.email)
      .forEach((item) => {
        const email = item.verifier_profile?.email as string;
        map.set(email, (map.get(email) || 0) + 1);
      });

    return [...map.entries()].map(([email, count]) => ({ email, count }));
  }, [achievements]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = achievements.filter((a) => {
      if (!query) return true;
      return [a.title, a.type, a.status, a.description || "", a.profiles?.name || "", a.profiles?.email || "", a.submitter_email || "", a.academic_year || "", a.accomplishment_date || "", a.verifier_profile?.email || ""]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    return next.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "status") return a.status.localeCompare(b.status);

      const tA = new Date(a.submitted_at || 0).getTime();
      const tB = new Date(b.submitted_at || 0).getTime();
      return sortBy === "latest" ? tB - tA : tA - tB;
    });
  }, [achievements, search, sortBy]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const updates: { status: "approved" | "rejected"; verified_at?: string; verified_by?: string | null } = { status };

    if (status === "approved") {
      updates.verified_at = new Date().toISOString();
      updates.verified_by = adminId;
    }

    if (status === "rejected") {
      updates.verified_by = null;
    }

    const { error } = await supabase.from("achievements").update(updates).eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAchievements(false);
  };

  if (authorizing) {
    return <div className="p-8 text-center text-gray-500">Checking admin access...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">{role === "head_admin" ? "Head Admin" : "Admin"}</p>

          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">Review & Verification Dashboard</h1>

          <p className="mt-1 text-sm text-gray-600">Approve or reject student submissions before publishing to the Wall of Fame.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="brand-card border-l-4 border-l-red-600 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Total Submissions</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{stats.total}</p>
          </div>

          <div className="brand-card border-l-4 border-l-amber-500 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-black text-amber-700">{stats.pending}</p>
          </div>

          <div className="brand-card border-l-4 border-l-emerald-500 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Approved</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{stats.approved}</p>
          </div>

          <div className="brand-card border-l-4 border-l-rose-500 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Rejected</p>
            <p className="mt-2 text-3xl font-black text-rose-700">{stats.rejected}</p>
          </div>
        </div>

        {role === "head_admin" && (
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="brand-card p-5">
              <h3 className="text-lg font-bold text-gray-900">Submission Status Split</h3>
              <div
                className="mx-auto mt-4 h-48 w-48 rounded-full"
                style={{
                  background: `conic-gradient(#16a34a 0 ${(stats.approved / Math.max(stats.total, 1)).toFixed(4)}turn, #f59e0b ${(stats.approved / Math.max(stats.total, 1)).toFixed(4)}turn ${((stats.approved + stats.pending) / Math.max(stats.total, 1)).toFixed(4)}turn, #f43f5e ${((stats.approved + stats.pending) / Math.max(stats.total, 1)).toFixed(4)}turn 1turn)`,
                }}
              />
            </div>

            <div className="brand-card p-5">
              <h3 className="text-lg font-bold text-gray-900">Category Distribution (Bar)</h3>
              <div className="mt-4 space-y-3">
                {categoryData.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs text-gray-600">
                      <span className="capitalize">{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-2 rounded bg-red-50">
                      <div className="h-2 rounded bg-red-600" style={{ width: `${(item.value / Math.max(stats.total, 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-card p-5 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-900">Admin Verification Analysis</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-red-100 text-left text-gray-600">
                      <th className="py-2">Admin Email</th>
                      <th className="py-2">Approved Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifierData.length === 0 ? (
                      <tr>
                        <td className="py-3 text-gray-500" colSpan={2}>
                          No approvals yet.
                        </td>
                      </tr>
                    ) : (
                      verifierData.map((item) => (
                        <tr key={item.email} className="border-b border-red-50">
                          <td className="py-2">{item.email}</td>
                          <td className="py-2">{item.count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">All Submissions</h2>
            <div className="grid w-full gap-3 md:w-auto md:grid-cols-[350px_180px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, title, type, status, verifier..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "oldest" | "title" | "status")}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="brand-card p-8 text-center text-gray-500">Loading submissions...</div>
          ) : filteredItems.length === 0 ? (
            <div className="brand-card p-8 text-center text-gray-500">No submissions match your filters.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((a) => (
                <div key={a.id}>
                  <ReviewPanel
                    title={a.title}
                    student={a.profiles?.name || "Unknown Student"}
                    type={a.type}
                    status={a.status}
                    description={a.description}
                    rank={a.rank}
                    submittedAt={a.submitted_at}
                    certificateUrl={
                      a.certificate
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${a.certificate}`
                        : undefined
                    }
                    onApprove={a.status === "pending" ? () => updateStatus(a.id, "approved") : undefined}
                    onReject={a.status === "pending" ? () => updateStatus(a.id, "rejected") : undefined}
                    busy={false}
                  />
                  <p className="mt-2 text-xs text-gray-600">Verified by: {a.verifier_profile?.email || "-"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {pendingItems.length > 0 && <p className="mt-5 text-xs text-gray-500">Pending reviews: {pendingItems.length}</p>}
      </div>
    </div>
  );
}
