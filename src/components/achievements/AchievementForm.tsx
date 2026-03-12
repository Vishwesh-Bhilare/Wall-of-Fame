"use client";

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