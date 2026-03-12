"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Achievement = {
  id: string;
  title: string;
  type: string;
  description?: string;
  status: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("achievements")
        .select("id,title,type,description,status")
        .eq("status", "approved")
        .or(`title.ilike.%${query}%,type.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(30);

      setResults((data as Achievement[]) || []);
      setLoading(false);
    };

    const timer = setTimeout(runSearch, 350);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-black text-gray-900 md:text-3xl">Search Verified Achievements</h1>
        <p className="mt-1 text-sm text-gray-600">Discover approved student work across the MMCOE Wall of Fame.</p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, type, or keyword..."
          className="brand-input mt-4"
        />

        <div className="mt-5">
          {loading ? (
            <div className="brand-card p-6 text-gray-500">Searching...</div>
          ) : !query.trim() ? (
            <div className="brand-card p-6 text-gray-500">Start typing to search verified wall posts.</div>
          ) : results.length === 0 ? (
            <div className="brand-card p-6 text-gray-500">No matching verified achievements found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <Link href={`/achievements/${item.id}`} key={item.id} className="brand-card p-5">
                  <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-red-700">{item.type}</p>
                  {item.description ? <p className="mt-2 text-sm text-gray-600">{item.description}</p> : null}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
