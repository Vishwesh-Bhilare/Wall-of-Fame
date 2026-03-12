"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FileUpload from "./FileUpload";
import Card from "../ui/Card";
import { ACHIEVEMENT_TYPES } from "@/constants/achievementTypes";
import { createAchievement } from "@/services/achievementService";
import type { AcademicYear, AchievementType } from "@/types/achievement";

const CATEGORY_FIELDS: Record<AchievementType, Array<"event" | "rank" | "doi" | "journal" | "patent" | "copyright">> = {
  publication: ["event", "doi", "journal"],
  hackathon: ["event", "rank"],
  patent: ["event", "patent"],
  copyright: ["event", "copyright"],
  course: ["event", "rank"],
  extracurricular: ["event", "rank"],
};

export default function AchievementForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<AchievementType>("publication");
  const [description, setDescription] = useState("");
  const [academicYear, setAcademicYear] = useState<AcademicYear | "">("");
  const [accomplishmentDate, setAccomplishmentDate] = useState("");
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

  const visibleFields = useMemo(() => CATEGORY_FIELDS[type], [type]);

  const handleTypeChange = (nextType: AchievementType) => {
    setType(nextType);
    const nextVisibleFields = CATEGORY_FIELDS[nextType];

    if (!nextVisibleFields.includes("rank")) setRank("");
    if (!nextVisibleFields.includes("doi")) setDoi("");
    if (!nextVisibleFields.includes("journal")) setJournalName("");
    if (!nextVisibleFields.includes("patent")) setPatentNumber("");
    if (!nextVisibleFields.includes("copyright")) setCopyrightNumber("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill title and description");
      return;
    }

    if (!academicYear) {
      alert("Please select your academic year (FY/SY/TY/BE)");
      return;
    }

    if (!accomplishmentDate) {
      alert("Please select accomplishment date");
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
      academic_year: academicYear,
      accomplishment_date: accomplishmentDate,
      submitter_email: user.email || null,
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
          <label className="mb-2 block text-sm font-semibold text-gray-700">Category</label>

          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as AchievementType)}
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

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
              required
            >
              <option value="">Select year</option>
              <option value="FY">FY</option>
              <option value="SY">SY</option>
              <option value="TY">TY</option>
              <option value="BE">BE</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Accomplishment Date</label>
            <input
              type="date"
              value={accomplishmentDate}
              onChange={(e) => setAccomplishmentDate(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {visibleFields.includes("event") && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Event / Platform (optional)</label>
            <Input placeholder="Smart India Hackathon 2025" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </div>
        )}

        {visibleFields.includes("rank") && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Prize / Rank / Credential ID</label>
            <Input placeholder="Top 5 / Credential ID" value={rank} onChange={(e) => setRank(e.target.value)} />
          </div>
        )}

        {visibleFields.includes("doi") && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">DOI</label>
              <Input placeholder="10.1000/xyz123" value={doi} onChange={(e) => setDoi(e.target.value)} />
            </div>

            {visibleFields.includes("journal") && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Journal Name</label>
                <Input placeholder="IEEE Access" value={journalName} onChange={(e) => setJournalName(e.target.value)} />
              </div>
            )}
          </div>
        )}

        {visibleFields.includes("patent") && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Patent Number</label>
            <Input placeholder="IN-2024-XXXX" value={patentNumber} onChange={(e) => setPatentNumber(e.target.value)} />
          </div>
        )}

        {visibleFields.includes("copyright") && (
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
          <label className="mb-2 block text-sm font-semibold text-gray-700">Certificate / Proof (PDF or Image)</label>
          <FileUpload onFileSelect={(f: File) => setFile(f)} />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit Achievement"}
        </Button>
      </form>
    </Card>
  );
}
