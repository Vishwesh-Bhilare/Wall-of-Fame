import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
