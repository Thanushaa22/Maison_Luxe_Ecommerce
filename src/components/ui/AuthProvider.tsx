"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useStore((s) => s.user.setUser);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
      });
  }, [setUser]);

  return <>{children}</>;
}
