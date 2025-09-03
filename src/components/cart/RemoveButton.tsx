"use client";
import { IoTrashOutline } from "react-icons/io5";

interface Props {
  onRemove: () => void;
}

export default function RemoveButton({ onRemove }: Props) {
  return (
    <button
      onClick={onRemove}
      aria-label="Remove item"
      className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 transition-colors rounded-full"
    >
      <IoTrashOutline className="text-xl" />
    </button>
  );
}
