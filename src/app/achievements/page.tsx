"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function AchievementsPage(){

const [achievements,setAchievements] = useState<any[]>([])

useEffect(()=>{
fetchAchievements()
},[])

const fetchAchievements = async ()=>{

const { data:{user} } = await supabase.auth.getUser()

if(!user) return

const { data } = await supabase
.from("achievements")
.select("*")
.eq("user_id",user.id)
.order("created_at",{ascending:false})

if(data) setAchievements(data)

}

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
My Achievements
</h1>

{achievements.length===0 ? (

<div className="bg-white p-6 rounded shadow">
No achievements submitted
</div>

):(

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{achievements.map((a)=>(

<Link
href={`/achievements/${a.id}`}
key={a.id}
>

<div className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer">

<h2 className="text-xl font-bold">
{a.title}
</h2>

<p className="text-gray-500 mt-2">
{a.type}
</p>

<span
className={`inline-block mt-3 px-3 py-1 rounded-full text-sm
${a.status==="approved" && "bg-green-100 text-green-700"}
${a.status==="pending" && "bg-yellow-100 text-yellow-700"}
${a.status==="rejected" && "bg-red-100 text-red-700"}
`}
>

{a.status}

</span>

</div>

</Link>

))}

</div>

)}

</div>

)
}