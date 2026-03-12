"use client"

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