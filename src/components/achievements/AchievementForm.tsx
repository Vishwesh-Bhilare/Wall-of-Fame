"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FileUpload from "./FileUpload";
import Card from "../ui/Card";
import { ACHIEVEMENT_TYPES } from "@/constants/achievementTypes";
import { createAchievement } from "@/services/achievementService";
import type { AchievementType } from "@/types/achievement";

export default function AchievementForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<AchievementType>("publication");
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [github, setGithub] = useState("");
  const [youtube, setYoutube] = useState("");
  const [rank, setRank] = useState("");
  const [doi, setDoi] = useState("");
  const [journalName, setJournalName] = useState("");
  const [patentNumber, setPatentNumber] = useState("");
  const [copyrightNumber, setCopyrightNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill title and description");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      setSubmitting(false);
      return;
    }

    let certificatePath = "";

    if (file) {
      const filePath = `${user.id}/cert-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("certificates").upload(filePath, file);

      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }

      certificatePath = data.path;
    }

    const { error } = await createAchievement({
      user_id: user.id,
      title: title.trim(),
      type,
      description: description.trim(),
      event_name: eventName.trim() || null,
      github: github.trim() || null,
      youtube: youtube.trim() || null,
      rank: rank.trim() || null,
      doi: doi.trim() || null,
      journal_name: journalName.trim() || null,
      patent_number: patentNumber.trim() || null,
      copyright_number: copyrightNumber.trim() || null,
      certificate: certificatePath || null,
      indexing: null,
    });

    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }

    alert("Achievement submitted for admin approval!");
    router.push("/achievements");
    router.refresh();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Achievement Title</label>
          <Input placeholder="IEEE Publication on AI-driven Healthcare" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Achievement Type</label>

          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            value={type}
            onChange={(e) => setType(e.target.value as AchievementType)}
          >
            {ACHIEVEMENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
            <option value="course">Course Completion</option>
            <option value="extracurricular">Extra Curricular</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Event / Platform (optional)</label>
          <Input placeholder="Smart India Hackathon 2025" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </div>

        {type === "hackathon" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Prize / Rank</label>
            <Input placeholder="Top 5" value={rank} onChange={(e) => setRank(e.target.value)} />
          </div>
        )}

        {type === "publication" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">DOI</label>
              <Input placeholder="10.1000/xyz123" value={doi} onChange={(e) => setDoi(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Journal Name</label>
              <Input placeholder="IEEE Access" value={journalName} onChange={(e) => setJournalName(e.target.value)} />
            </div>
          </div>
        )}

        {type === "patent" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Patent Number</label>
            <Input placeholder="IN-2024-XXXX" value={patentNumber} onChange={(e) => setPatentNumber(e.target.value)} />
          </div>
        )}

        {type === "copyright" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Copyright Number</label>
            <Input placeholder="L-12345/2025" value={copyrightNumber} onChange={(e) => setCopyrightNumber(e.target.value)} />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>

          <textarea
            placeholder="Explain what you achieved, impact, and outcome."
            className="min-h-28 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">GitHub Link</label>
            <Input placeholder="https://github.com/..." value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">YouTube Demo Link</label>
            <Input placeholder="https://youtube.com/..." value={youtube} onChange={(e) => setYoutube(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Certificate / Proof (optional)</label>
          <FileUpload onFileSelect={(f: File) => setFile(f)} />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit Achievement"}
        </Button>
      </form>
    </Card>
  );
}
