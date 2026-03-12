"use client";

import { useState } from "react";

export default function FileUpload({ onFileSelect }: any) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="border p-4 rounded bg-gray-50">

      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            const file = e.target.files[0];
            setFileName(file.name);
            onFileSelect(file);
          }
        }}
      />

      {fileName && (
        <p className="text-sm mt-2 text-green-600">
          Selected: {fileName}
        </p>
      )}

    </div>
  );
}