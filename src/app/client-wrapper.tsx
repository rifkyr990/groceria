"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const hydrate = useAuthStore((state) => state.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return <>{children}</>;
}
