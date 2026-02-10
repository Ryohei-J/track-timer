"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<Theme>("pomodisc:theme", "dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  // Prevent hydration mismatch by not rendering icon until mounted
  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full flex items-center justify-center
        bg-surface-alt hover:bg-surface-alt/80 transition-colors
        text-text-primary text-xl"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
    </button>
  );
}
