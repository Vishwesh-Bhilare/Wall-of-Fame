"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AchievementForm() {

const [type,setType] = useState("Patent")
const [title,setTitle] = useState("")
const [rank,setRank] = useState("")
const [github,setGithub] = useState("")
const [youtube,setYoutube] = useState("")
const [description,setDescription] = useState("")
const [file,setFile] = useState<File | null>(null)

const submitAchievement = async (e:any) => {

e.preventDefault() // 🔴 VERY IMPORTANT

console.log("Submitting achievement...")

const { data:{user} } = await supabase.auth.getUser()

if(!user){
alert("User not logged in")
return
}

let certificate = ""

if(file){

const { data,error } = await supabase.storage
.from("certificates")
.upload(`proof-${Date.now()}-${file.name}`,file)

if(error){
console.log(error)
alert(error.message)
return
}

certificate = data.path
}

const { error } = await supabase
.from("achievements")
.insert({
user_id:user.id,
title,
type,
rank,
github,
youtube,
description,
certificate,
status:"pending"
})

if(error){
console.log(error)
alert(error.message)
return
}

alert("Achievement submitted successfully")

}

return (

<form
onSubmit={submitAchievement}
className="space-y-4"
>

<select
value={type}
onChange={(e)=>setType(e.target.value)}
className="w-full border p-3 rounded"
>

<option>Hackathon</option>
<option>Patent</option>
<option>Course Completion</option>
<option>Extra Curricular</option>

</select>

<input
placeholder="Achievement Title"
className="w-full border p-3 rounded"
onChange={(e)=>setTitle(e.target.value)}
/>

<input
placeholder="Rank / Patent Number"
className="w-full border p-3 rounded"
onChange={(e)=>setRank(e.target.value)}
/>

<input
placeholder="Github Link"
className="w-full border p-3 rounded"
onChange={(e)=>setGithub(e.target.value)}
/>

<input
placeholder="Youtube Demo"
className="w-full border p-3 rounded"
onChange={(e)=>setYoutube(e.target.value)}
/>

<textarea
placeholder="Description"
className="w-full border p-3 rounded"
onChange={(e)=>setDescription(e.target.value)}
/>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
/>

<button
type="submit"
className="bg-green-600 text-white px-6 py-2 rounded"
>
Submit
</button>

</form>

)
}