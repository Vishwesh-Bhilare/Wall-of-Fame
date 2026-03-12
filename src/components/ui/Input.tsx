import React from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded"
    />
  );
}
