"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import StatsCard from "@/components/dashboard/StatsCard"
import ActivityFeed from "@/components/dashboard/ActivityFeed"

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {

    const { data } = await supabase
      .from("achievements")
      .select("*")

    if (!data) return

    const total = data.length
    const pending = data.filter(a => a.status === "pending").length
    const approved = data.filter(a => a.status === "approved").length
    const rejected = data.filter(a => a.status === "rejected").length

    setStats({ total, pending, approved, rejected })

    const activityData = data.slice(0,5).map(a => ({
      id: a.id,
      message: `New ${a.type} submitted: ${a.title}`
    }))

    setActivities(activityData)
  }

  return (
    <div className="min-h-screen p-10 bg-gray-50">

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-6 mb-10">

        <StatsCard title="Total Achievements" value={stats.total} />

        <StatsCard title="Pending" value={stats.pending} color="text-yellow-500" />

        <StatsCard title="Approved" value={stats.approved} color="text-green-600" />

        <StatsCard title="Rejected" value={stats.rejected} color="text-red-600" />

      </div>

      {/* Activity */}

      <ActivityFeed activities={activities} />

    </div>
  )
}