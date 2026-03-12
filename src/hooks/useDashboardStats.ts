"use client";

import { useEffect, useState } from "react";
import { getAchievements } from "../services/achievementService";

export default function useDashboardStats(userId: string) {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const { data } = await getAchievements(userId);

      if (!data) return;

      const total = data.length;
      const approved = data.filter((a: any) => a.status === "approved").length;
      const pending = data.filter((a: any) => a.status === "pending").length;
      const rejected = data.filter((a: any) => a.status === "rejected").length;

      setStats({ total, approved, pending, rejected });
    }

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  return stats;
}