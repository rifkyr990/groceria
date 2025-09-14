"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function StoreInitializer() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  return null;
}
