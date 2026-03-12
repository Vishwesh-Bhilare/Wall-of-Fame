"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Achievement = {
  id: string;
  title: string;
  type: string;
  rank?: string;
  status: "approved" | "pending" | "rejected";
  created_at?: string;
};

const chipStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function Dashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("achievements")
        .select("id,title,type,rank,status,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setAchievements((data as Achievement[]) || []);
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  const stats = useMemo(() => {
    const approved = achievements.filter((a) => a.status === "approved").length;
    const pending = achievements.filter((a) => a.status === "pending").length;
    const rejected = achievements.filter((a) => a.status === "rejected").length;
    return { total: achievements.length, approved, pending, rejected };
  }, [achievements]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="brand-card mb-6 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Student Dashboard</p>
              <h1 className="mt-1 text-2xl font-black text-gray-900 md:text-3xl">My Achievement Overview</h1>
              <p className="mt-1 text-sm text-gray-600">Track your submissions and monitor admin verification status.</p>
            </div>
            <Link href="/achievements/new" className="brand-button">
              + Submit New Achievement
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="brand-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Total</p>
            <p className="mt-1 text-3xl font-black">{stats.total}</p>
          </div>
          <div className="brand-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Approved</p>
            <p className="mt-1 text-3xl font-black text-emerald-700">{stats.approved}</p>
          </div>
          <div className="brand-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Pending</p>
            <p className="mt-1 text-3xl font-black text-amber-700">{stats.pending}</p>
          </div>
          <div className="brand-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Rejected</p>
            <p className="mt-1 text-3xl font-black text-rose-700">{stats.rejected}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Submissions</h2>
            <Link href="/achievements" className="text-sm font-semibold text-red-700 hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="brand-card p-8 text-center text-gray-500">Loading submissions...</div>
          ) : achievements.length === 0 ? (
            <div className="brand-card p-8 text-center text-gray-500">No achievements submitted yet.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {achievements.slice(0, 6).map((item) => (
                <Link href={`/achievements/${item.id}`} key={item.id} className="brand-card p-5 transition hover:-translate-y-0.5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <p className="text-lg font-bold text-gray-900">{item.title}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${chipStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-red-700">{item.type}</p>
                  {item.rank ? <p className="mt-1 text-sm text-gray-600">Rank/ID: {item.rank}</p> : null}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {

const [showForm, setShowForm] = useState(false)

const [type, setType] = useState("Hackathon")
const [title, setTitle] = useState("")
const [rank, setRank] = useState("")
const [github, setGithub] = useState("")
const [youtube, setYoutube] = useState("")
const [description, setDescription] = useState("")
const [file, setFile] = useState<File | null>(null)

const [achievements, setAchievements] = useState<any[]>([])


/* FETCH ACHIEVEMENTS */

useEffect(() => {
fetchAchievements()
}, [])

const fetchAchievements = async () => {

const { data: userData } = await supabase.auth.getUser()

const user = userData?.user

if (!user) return

const { data, error } = await supabase
.from("achievements")
.select("*")
.eq("user_id", user.id)
.order("created_at", { ascending: false })

if (error) {
console.error(error)
return
}

if (data) setAchievements(data)

}


/* SUBMIT ACHIEVEMENT */

const submitAchievement = async () => {

const { data: userData } = await supabase.auth.getUser()

const user = userData?.user

if (!user) {
alert("User not logged in")
return
}

let fileUrl = ""

if (file) {

const fileExt = file.name.split(".").pop()

const fileName = `proof-${Date.now()}.${fileExt}`

const { data, error: uploadError } = await supabase.storage
.from("certificates")
.upload(fileName, file)

if (uploadError) {
console.error(uploadError)
alert(uploadError.message)
return
}

fileUrl = data.path

}

const { error } = await supabase
.from("achievements")
.insert({
user_id: user.id,
title,
type,
rank,
github,
youtube,
description,
certificate: fileUrl,
status: "pending"
})

if (error) {
console.error(error)
alert(error.message)
return
}

alert("Submitted for admin approval")

setShowForm(false)

setTitle("")
setRank("")
setGithub("")
setYoutube("")
setDescription("")
setFile(null)

fetchAchievements()

}


/* UI */

return (

<div className="min-h-screen p-10 bg-gradient-to-br from-gray-50 to-blue-50">

<h1 className="text-4xl font-bold mb-8">
My Achievements
</h1>


<button
onClick={() => setShowForm(true)}
className="mb-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
>
+ Submit Achievement
</button>


{/* ACHIEVEMENTS */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{achievements.map((a) => (

<div
key={a.id}
className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
>

<h2 className="text-xl font-bold">
{a.title}
</h2>

<p className="text-gray-500 mt-1">
{a.type}
</p>

<span className={`mt-3 inline-block px-3 py-1 rounded-full text-sm
${a.status === "approved" && "bg-green-100 text-green-700"}
${a.status === "pending" && "bg-yellow-100 text-yellow-700"}
${a.status === "rejected" && "bg-red-100 text-red-700"}
`}>
{a.status}
</span>

</div>

))}

</div>


{/* FORM MODAL */}

{showForm && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">

<h2 className="text-2xl font-bold mb-6">
Submit Achievement
</h2>


<select
value={type}
onChange={(e) => setType(e.target.value)}
className="w-full border p-3 rounded-lg mb-4"
>
<option>Hackathon</option>
<option>Patent</option>
<option>Course Completion</option>
<option>Extra Curricular Activity</option>
</select>


<input
type="text"
placeholder="Achievement Title"
className="w-full border p-3 rounded-lg mb-4"
value={title}
onChange={(e) => setTitle(e.target.value)}
/>


<input
type="text"
placeholder="Prize / Rank"
className="w-full border p-3 rounded-lg mb-4"
value={rank}
onChange={(e) => setRank(e.target.value)}
/>


<input
type="text"
placeholder="GitHub Repository"
className="w-full border p-3 rounded-lg mb-4"
value={github}
onChange={(e) => setGithub(e.target.value)}
/>


<input
type="text"
placeholder="YouTube Demo Link"
className="w-full border p-3 rounded-lg mb-4"
value={youtube}
onChange={(e) => setYoutube(e.target.value)}
/>


<textarea
placeholder="Description"
className="w-full border p-3 rounded-lg mb-4"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>


<input
type="file"
onChange={(e) => setFile(e.target.files?.[0] || null)}
className="mb-4"
/>


<div className="flex justify-end gap-3">

<button
onClick={() => setShowForm(false)}
className="px-4 py-2 bg-gray-200 rounded-lg"
>
Cancel
</button>

<button
onClick={submitAchievement}
className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
Submit
</button>

</div>

</div>

</div>

)}

</div>

)
}
