"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import LoadingScreen from "@/components/LoadingScreen";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrate = useAuthStore((state) => state.hydrate);
  const [hydrated, setHydrated] = useState(false); // arco

  useEffect(() => {
    hydrate();
    setHydrated(true); //arco
  }, [hydrate]);

  if (!hydrated) return <LoadingScreen />;

  return <>{children}</>;
}
