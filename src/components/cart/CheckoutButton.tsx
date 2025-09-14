"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatIDRCurrency } from "@/utils/format";
import { IoLockClosed } from "react-icons/io5";

interface CheckoutButtonProps {
  total: number;
  onClick: () => Promise<void> | void;
  mode: "cart" | "checkout";
  disabled?: boolean;
}

export default function CheckoutButton({
  total,
  onClick,
  mode,
  disabled = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const config = useMemo(() => {
    switch (mode) {
      case "checkout":
        return {
          text: "Place Order",
          loadingText: "Processing...",
          icon: null,
          showPrice: true,
          style:
            "bg-primary-green-600 hover:bg-primary-green-700 shadow-primary-green-500/40",
        };
      case "cart":
      default:
        return {
          text: "Proceed to Checkout",
          loadingText: "Processing...",
          icon: <IoLockClosed className="text-base sm:text-lg scale-x-110" />,
          showPrice: false,
          style:
            "bg-primary-green-600 hover:bg-primary-green-700 shadow-primary-green-500/40",
        };
    }
  }, [mode]);

  const handleClick = async () => {
    if (loading || disabled) return;

    setLoading(true);
    setText(config.loadingText);

    try {
      if (mode === "cart") {
        await new Promise((res) => setTimeout(res, 1500));
        setText("Redirecting...");
      }
      await onClick();
    } catch (error) {
      console.error("Action failed", error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading || disabled || total === 0}
      className={cn(
        "w-full p-6 py-7 sm:p-6 sm:py-7 rounded-xl flex items-center justify-between transform transition-all shadow-lg",
        "hover:scale-105 hover:shadow-xl active:scale-95",
        "disabled:bg-gray-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed",
        loading
          ? "bg-gradient-to-r from-primary-green-600 to-primary-green-500 cursor-not-allowed animate-pulse-subtle disabled:opacity-100"
          : config.style,
        "text-white font-bold"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {loading && (
          <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-black rounded-full animate-spin flex-shrink-0"></span>
        )}
        <span className="text-sm sm:text-lg font-sans truncate">
          {loading ? text : config.text}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        {config.showPrice && (
          <span className="font-semibold">{formatIDRCurrency(total)}</span>
        )}
        {config.icon}
      </div>
    </Button>
  );
}
