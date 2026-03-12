"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AchievementForm() {
  const [type, setType] = useState("Patent");
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");
  const [github, setGithub] = useState("");
  const [youtube, setYoutube] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submitAchievement = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please add title and description");
      return;
    }

    setSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert("User not logged in");
      setSubmitting(false);
      return;
    }

    let certificate = "";

    if (file) {
      const { data, error } = await supabase.storage
        .from("certificates")
        .upload(`proof-${Date.now()}-${file.name}`, file);

      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }

      certificate = data.path;
    }

    const { error } = await supabase.from("achievements").insert({
      user_id: user.id,
      title,
      type,
      rank,
      github,
      youtube,
      description,
      certificate,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }

    alert("Achievement submitted for admin approval.");
    setSubmitting(false);
    setTitle("");
    setRank("");
    setGithub("");
    setYoutube("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">Submission</p>
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl">Submit New Achievement</h1>
          </div>
          <Link href="/achievements" className="brand-button-secondary">
            Back
          </Link>
        </div>

        <form onSubmit={submitAchievement} className="brand-card space-y-4 p-6 md:p-8">
          <div>
            <label className="brand-label" htmlFor="type">
              Category
            </label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="brand-input">
              <option>Hackathon</option>
              <option>Patent</option>
              <option>Course Completion</option>
              <option>Extra Curricular</option>
              <option>Research Publication</option>
            </select>
          </div>

          <div>
            <label className="brand-label" htmlFor="title">
              Achievement Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="brand-input"
              placeholder="National Hackathon Finalist"
            />
          </div>

          <div>
            <label className="brand-label" htmlFor="rank">
              Rank / Patent Number (optional)
            </label>
            <input
              id="rank"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="brand-input"
              placeholder="Top 10 / 2024-XX-YYY"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="brand-label" htmlFor="github">
                GitHub Link (optional)
              </label>
              <input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="brand-input"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="brand-label" htmlFor="youtube">
                YouTube Demo (optional)
              </label>
              <input
                id="youtube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="brand-input"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          <div>
            <label className="brand-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="brand-input min-h-28"
              placeholder="Explain your achievement impact, scope, and outcomes."
            />
          </div>

          <div>
            <label className="brand-label" htmlFor="certificate">
              Upload Certificate / Proof (optional)
            </label>
            <input
              id="certificate"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="brand-input file:mr-3 file:rounded-md file:border-0 file:bg-red-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>

          <button type="submit" className="brand-button w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
}
