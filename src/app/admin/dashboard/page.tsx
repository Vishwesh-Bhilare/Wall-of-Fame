"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ReviewPanel from "../ReviewPanel";
import StatsCard from "@/components/dashboard/StatsCard";

type Achievement = {
  id: string;
  title: string;
  type: string;
  status: "approved" | "pending" | "rejected";
  certificate?: string;
  profiles?: { name?: string } | null;
};

export default function AdminDashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("achievements")
      .select("id,title,type,status,certificate,profiles(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setAchievements((data as Achievement[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const pendingItems = achievements.filter((a) => a.status === "pending");

  const stats = useMemo(() => {
    const approved = achievements.filter((a) => a.status === "approved").length;
    const rejected = achievements.filter((a) => a.status === "rejected").length;
    const pending = achievements.filter((a) => a.status === "pending").length;
    return { total: achievements.length, approved, pending, rejected };
  }, [achievements]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("achievements").update({ status }).eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }

    fetchAchievements();
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Admin</p>
          <h1 className="text-2xl font-black text-gray-900 md:text-3xl">Review & Verification Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Approve or reject student submissions before publishing to the Wall of Fame.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Submissions" value={stats.total} color="text-gray-900" />
          <StatsCard title="Pending" value={stats.pending} color="text-amber-700" />
          <StatsCard title="Approved" value={stats.approved} color="text-emerald-700" />
          <StatsCard title="Rejected" value={stats.rejected} color="text-rose-700" />
        </div>

        <div className="mt-7">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Pending Reviews</h2>

          {loading ? (
            <div className="brand-card p-8 text-center text-gray-500">Loading submissions...</div>
          ) : pendingItems.length === 0 ? (
            <div className="brand-card p-8 text-center text-gray-500">No pending achievements. Great job!</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingItems.map((a) => (
                <ReviewPanel
                  key={a.id}
                  title={a.title}
                  student={a.profiles?.name || "Unknown Student"}
                  type={a.type}
                  status={a.status}
                  certificateUrl={
                    a.certificate
                      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${a.certificate}`
                      : undefined
                  }
                  onApprove={() => updateStatus(a.id, "approved")}
                  onReject={() => updateStatus(a.id, "rejected")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminDashboard() {

const [achievements, setAchievements] = useState<any[]>([])

useEffect(() => {
fetchAchievements()
}, [])

const fetchAchievements = async () => {

const { data, error } = await supabase
.from("achievements")
.select(`
  *,
  profiles(name)
`)
.eq("status", "pending")

if (error) {
console.error(error)
return
}

setAchievements(data || [])

}

const approve = async (id: string) => {

await supabase
.from("achievements")
.update({ status: "approved" })
.eq("id", id)

fetchAchievements()

}

const reject = async (id: string) => {

await supabase
.from("achievements")
.update({ status: "rejected" })
.eq("id", id)

fetchAchievements()

}

return (

<div className="min-h-screen p-10 bg-gray-50">

<h1 className="text-3xl font-bold mb-8">
Admin Dashboard
</h1>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{achievements.map((a) => (

<div
key={a.id}
className="bg-white p-6 rounded-xl shadow"
>

<h2 className="text-xl font-bold">
{a.title}
</h2>

<p className="text-gray-500 mt-1">
Type: {a.type}
</p>

<p className="text-gray-500">
Student: {a.profiles?.name || "Unknown"}
</p>

{a.certificate && (
<a
href={`https://qadxglmavgmmutigeidg.supabase.co/storage/v1/object/public/achievement-images/${a.certificate}`}
target="_blank"
className="text-blue-600 underline mt-2 block"
>
View Proof
</a>
)}

<div className="flex gap-3 mt-4">

<button
onClick={() => approve(a.id)}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Approve
</button>

<button
onClick={() => reject(a.id)}
className="bg-red-600 text-white px-4 py-2 rounded"
>
Reject
</button>

</div>

</div>

))}

</div>

</div>

)

}
