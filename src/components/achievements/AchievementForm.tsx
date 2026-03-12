"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FileUpload from "./FileUpload";
import Card from "../ui/Card";

type AchievementType = "publication" | "hackathon" | "patent" | "course" | "extracurricular";

export default function AchievementForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<AchievementType>("publication");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [youtube, setYoutube] = useState("");
  const [rank, setRank] = useState("");
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

    let certificateUrl = "";

    if (file) {
      const { data, error } = await supabase.storage
        .from("certificates")
        .upload(`cert-${Date.now()}-${file.name}`, file);

      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }

      certificateUrl = data.path;
    }

    const { error } = await supabase.from("achievements").insert({
      user_id: user.id,
      title,
      type,
      description,
      github,
      youtube,
      rank,
      certificate: certificateUrl,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }

    alert("Achievement submitted for admin approval!");

    setTitle("");
    setType("publication");
    setDescription("");
    setGithub("");
    setYoutube("");
    setRank("");
    setFile(null);
    setSubmitting(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Achievement Title</label>
          <Input
            placeholder="IEEE Publication on AI-driven Healthcare"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Achievement Type</label>
          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            value={type}
            onChange={(e) => setType(e.target.value as AchievementType)}
          >
            <option value="publication">Publication</option>
            <option value="hackathon">Hackathon</option>
            <option value="patent">Patent</option>
            <option value="course">Course Completion</option>
            <option value="extracurricular">Extra Curricular</option>
          </select>
        </div>

        {(type === "hackathon" || type === "patent") && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {type === "hackathon" ? "Prize / Rank" : "Patent Number"}
            </label>
            <Input
              placeholder={type === "hackathon" ? "Top 5" : "IN-2024-XXXX"}
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
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
            <Input
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">YouTube Demo Link</label>
            <Input
              placeholder="https://youtube.com/..."
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Certificate / Proof (optional)</label>
          <FileUpload onFileSelect={(selectedFile: File) => setFile(selectedFile)} />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit Achievement"}
        </Button>
      </form>
    </Card>
  );
}"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Button from "../ui/Button";
import Input from "../ui/Input";
import FileUpload from "./FileUpload";

export default function AchievementForm() {

  const [title, setTitle] = useState("");
  const [type, setType] = useState("publication");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [youtube, setYoutube] = useState("");
  const [rank, setRank] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("User not logged in");
      return;
    }

    let certificateUrl = "";

    if (file) {
      const { data, error } = await supabase.storage
        .from("certificates")
        .upload(`cert-${Date.now()}`, file);

      if (error) {
        alert(error.message);
        return;
      }

      certificateUrl = data.path;
    }

    const { error } = await supabase
      .from("achievements")
      .insert({
        user_id: user.id,
        title,
        type,
        description,
        github,
        youtube,
        rank,
        certificate: certificateUrl,
        status: "pending"
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Achievement submitted for admin approval!");

    setTitle("");
    setDescription("");
    setGithub("");
    setYoutube("");
    setRank("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">

      <Input
        placeholder="Achievement Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Achievement Type */}

      <select
        className="border p-2 w-full rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="publication">Publication</option>
        <option value="hackathon">Hackathon</option>
        <option value="patent">Patent</option>
        <option value="course">Course Completion</option>
        <option value="extracurricular">Extra Curricular</option>
      </select>

      {/* Dynamic Fields */}

      {type === "hackathon" && (
        <Input
          placeholder="Prize / Rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />
      )}

      {type === "publication" && (
        <Input
          placeholder="Journal / Conference Name"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      )}

      {type === "patent" && (
        <Input
          placeholder="Patent Number"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />
      )}

      <Input
        placeholder="GitHub Repository Link"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />

      <Input
        placeholder="YouTube Demo Link"
        value={youtube}
        onChange={(e) => setYoutube(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* File Upload */}

      <FileUpload onFileSelect={(file: File) => setFile(file)} />

      <Button type="submit">
        Submit Achievement
      </Button>

    </form>
  );
}
