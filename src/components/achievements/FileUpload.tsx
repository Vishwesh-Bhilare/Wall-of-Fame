"use client";

import { useMemo, useState } from "react";

export default function FileUpload({ onFileSelect }: any) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  const isPdf = file?.type === "application/pdf";
  const isImage = !!file?.type.startsWith("image/");

  return (
    <div className="rounded border p-4 bg-gray-50">
      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={(e) => {
          if (e.target.files) {
            const nextFile = e.target.files[0];
            setFile(nextFile);
            setFileName(nextFile.name);
            onFileSelect(nextFile);
          }
        }}
      />

      {fileName && <p className="text-sm mt-2 text-green-600">Selected: {fileName}</p>}

      {previewUrl && isImage && <img src={previewUrl} alt="Selected proof" className="mt-3 h-32 rounded object-cover" />}
      {previewUrl && isPdf && <iframe title="Selected PDF proof" src={previewUrl} className="mt-3 h-40 w-full rounded" />}
    </div>
  );
}
