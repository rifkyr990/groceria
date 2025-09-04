import { IoTrashOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface RemoveButtonProps {
  id: string;
  onRemove: (id: string) => void;
}

export default function RemoveButton({ id, onRemove }: RemoveButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full"
      onClick={() => onRemove(id)}
    >
      <IoTrashOutline className="text-xl" />
    </Button>
  );
}
