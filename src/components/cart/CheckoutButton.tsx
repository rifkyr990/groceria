"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIDRCurrency } from "@/utils/format";

interface CheckoutButtonProps {
  total: number;
  onCheckout?: () => Promise<void> | void;
}

export default function CheckoutButton({
  total,
  onCheckout,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Proceed to Checkout");

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    setText("Processing...");

    try {
      if (onCheckout) await onCheckout();

      await new Promise((res) => setTimeout(res, 2000));

      setText("Redirecting...");
      await new Promise((res) => setTimeout(res, 1000));
    } finally {
      setLoading(false);
      setText("Proceed to Checkout");

      // alert(`Checking out. Total: ${formatIDRCurrency(total)}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "w-full p-6 rounded-xl flex items-center py-8 justify-between transform transition-all shadow-lg shadow-primary-green-500/40",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        loading
          ? "bg-gradient-to-r from-primary-green-600 to-primary-green-500 cursor-not-allowed animate-pulse-subtle disabled:opacity-100"
          : "bg-primary-green-600 hover:bg-primary-green-700",
        "text-white font-bold"
      )}
    >
      <div className="flex items-center gap-3 min-w-[180px]">
        {loading && (
          <span className="w-5 h-5 border-2 border-white border-t-black rounded-full animate-spin"></span>
        )}
        <span className="text-lg font-sans">{text}</span>
      </div>

      <span className="font-mono text-lg font-bold whitespace-nowrap">
        {formatIDRCurrency(total)}
      </span>
    </Button>
  );
}
