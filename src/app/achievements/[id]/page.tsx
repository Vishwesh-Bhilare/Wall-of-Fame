"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useParams } from "next/navigation"

export default function AchievementDetails(){

const { id } = useParams()

const [achievement,setAchievement] = useState<any>(null)

useEffect(()=>{
fetchAchievement()
},[])

const fetchAchievement = async ()=>{

const { data } = await supabase
.from("achievements")
.select("*")
.eq("id",id)
.single()

if(data) setAchievement(data)

}

if(!achievement){
return <div className="p-10">Loading...</div>
}

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Achievement Details
</h1>

<div className="bg-white p-6 rounded shadow max-w-xl">

<h2 className="text-2xl font-bold">
{achievement.title}
</h2>

<p className="text-gray-500 mt-2">
Type: {achievement.type}
</p>

<p className="mt-4">
{achievement.description}
</p>

{achievement.certificate && (

<a
href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/${achievement.certificate}`}
target="_blank"
className="text-blue-600 block mt-4"
>

View Certificate

</a>

)}

<span
className={`inline-block mt-4 px-3 py-1 rounded-full text-sm
${achievement.status==="approved" && "bg-green-100 text-green-700"}
${achievement.status==="pending" && "bg-yellow-100 text-yellow-700"}
${achievement.status==="rejected" && "bg-red-100 text-red-700"}
`}
>

{achievement.status}

</span>

</div>

</div>
)
}